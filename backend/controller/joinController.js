const Join = require("../models/joinSchema");
const User = require("../models/User");
const Gym = require("../models/GymSchema");
const Member = require("../models/Member");
const mongoose = require("mongoose");

exports.joinRequest = async (req, res) => {
    try {
        const { gymId } = req.body;
        if (!gymId) {
            return res.status(400).json({ message: "Gym ID is required" });
        }

        const memberId = req.user.userId;

        const existingRequest = await Join.findOne({ member: memberId, gym: gymId });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }

        const joinRequest = new Join({
            member: memberId,
            gym: gymId, 
            status: "pending"
        });

        await joinRequest.save();

        res.status(201).json({ 
            message: "Join request sent successfully",
            requestId: joinRequest._id 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Sending Join Request!!" });
    }
};



exports.processJoinRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const joinRequest = await Join.findById(requestId);
        
        if (!joinRequest) {
            return res.status(404).json({ message: "Join request not found" });
        }

        const gym = await Gym.findById(joinRequest.gym);
        if (!gym) {
            return res.status(404).json({ message: "Gym not found" });
        }

        if (gym.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: caller is not the gym owner" });
        }

        // Update the request status
        joinRequest.status = status;
        await joinRequest.save();

        // If approved, add member to gym and update the user's gymId
        if (status === 'approved') {
            const gym = await Gym.findById(joinRequest.gym);
            if (!gym.members?.includes(joinRequest.member)) { 
                gym.members?.push(joinRequest.member);
                await gym.save();
            }

            // Update the user's gymId
            await User.findByIdAndUpdate(joinRequest.member, { gymId: gym._id });
        }

        // Return the updated request
        const updatedRequest = await Join.findById(requestId)
            .populate('member', 'name email gymId');

        console.log('Updated request:', updatedRequest);
        res.json(updatedRequest);

    } catch (error) {
        console.error('Error in processJoinRequest:', error);
        res.status(500).json({ 
            message: "Error processing join request",
            error: error.message 
        });
    }
};



exports.getJoinRequests = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        console.log('Fetching requests for user:', userId, 'with role:', userRole);

        if (userRole === 'member') {
            // For members, fetch their own join requests
            const joinRequests = await Join.find({ member: userId })
                .populate('member', 'name email')
                .populate('gym', 'name')
                .sort({ createdAt: -1 });
            
            return res.json(joinRequests);
        }

        // For gym owners
        const gym = await Gym.findOne({ owner: userId });
        
        if (!gym) {
            return res.status(404).json({ 
                message: "No gym found for this owner." 
            });
        }

        // Fetch all join requests for the gym
        const joinRequests = await Join.find({ gym: gym._id })
            .populate('member', 'name email')
            .sort({ createdAt: -1 }); // Most recent first

            console.log('Gym owner requests:', joinRequests);
        res.json(joinRequests);

    } catch (error) {
        console.error('Error in getJoinRequests:', error);
        res.status(500).json({ 
            message: "Error fetching join requests",
            error: error.message 
        });
    }
};

const calculateOneMonthEndDate = (startDate) => {
  const start = new Date(startDate);
  const targetMonth = start.getMonth() + 1;
  const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = targetMonth % 12;
  const originalDay = start.getDate();
  const daysInTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const clampedDay = Math.min(originalDay, daysInTargetMonth);
  return new Date(targetYear, normalizedMonth, clampedDay, start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
};

exports.quickApprove = async (req, res) => {
  const { joinRequestId } = req.body;
  const callerUserId = req.user.userId;
  const callerRole = req.user.role;

  if (!joinRequestId || !mongoose.Types.ObjectId.isValid(joinRequestId)) {
    return res.status(400).json({ message: "Valid joinRequestId is required" });
  }

  try {
    const joinRequest = await Join.findById(joinRequestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    const gym = await Gym.findById(joinRequest.gym);
    if (!gym) {
      return res.status(404).json({ message: "Gym for this request not found" });
    }

    // Caller must own the gym (or be admin)
    if (gym.owner.toString() !== callerUserId && callerRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized: caller does not own this gym" });
    }

    // Must be in pending status
    if (joinRequest.status !== "pending") {
      return res.status(409).json({ message: `Join request is already ${joinRequest.status}` });
    }

    // Check if Member already exists for this joinRequestId
    const existingMember = await Member.findOne({ joinRequestId });
    if (existingMember) {
      return res.status(409).json({ message: "Member already exists for this join request" });
    }

    if (!gym.memberShipPlans || gym.memberShipPlans.length === 0) {
      return res.status(400).json({ message: "Gym has no membership plans configured" });
    }

    const firstPlan = gym.memberShipPlans[0];
    const startDate = new Date();
    const endDate = calculateOneMonthEndDate(startDate);

    let session = null;
    let usedTransaction = false;

    try {
      session = await mongoose.startSession();
      session.startTransaction();
      usedTransaction = true;
    } catch (sessionErr) {
      session = null;
      usedTransaction = false;
    }

    let newMember;

    if (usedTransaction && session) {
      try {
        joinRequest.status = "approved";
        await joinRequest.save({ session });

        newMember = new Member({
          joinRequestId: joinRequest._id,
          user: joinRequest.member,
          gym: joinRequest.gym,
          memberShipPlan: {
            name: firstPlan.name,
            duration: firstPlan.duration || "Monthly",
            price: firstPlan.price,
            startDate,
            endDate,
          },
          status: "active",
          paymentStatus: "pending",
          healthInfo: {
            medicalConditions: [],
            allergies: [],
            bloodGroup: "",
          },
          measurements: {},
          exercisePlan: {},
          dietPlan: [],
        });

        await newMember.save({ session });

        await User.findByIdAndUpdate(joinRequest.member, { gymId: gym._id }, { session });

        await session.commitTransaction();
        session.endSession();
      } catch (txErr) {
        await session.abortTransaction();
        session.endSession();
        if (txErr.code === 11000) {
          return res.status(409).json({ message: "Member already exists for this join request" });
        }
        throw txErr;
      }
    } else {
      // Ordered operations with compensation fallback
      const originalStatus = joinRequest.status;
      let memberCreated = false;
      try {
        joinRequest.status = "approved";
        await joinRequest.save();

        newMember = new Member({
          joinRequestId: joinRequest._id,
          user: joinRequest.member,
          gym: joinRequest.gym,
          memberShipPlan: {
            name: firstPlan.name,
            duration: firstPlan.duration || "Monthly",
            price: firstPlan.price,
            startDate,
            endDate,
          },
          status: "active",
          paymentStatus: "pending",
          healthInfo: {
            medicalConditions: [],
            allergies: [],
            bloodGroup: "",
          },
          measurements: {},
          exercisePlan: {},
          dietPlan: [],
        });

        await newMember.save();
        memberCreated = true;

        await User.findByIdAndUpdate(joinRequest.member, { gymId: gym._id });
      } catch (opErr) {
        try {
          if (memberCreated && newMember?._id) {
            await Member.findByIdAndDelete(newMember._id);
          }
          joinRequest.status = originalStatus;
          await joinRequest.save();
        } catch (cleanupErr) {
          console.error("Compensation error:", cleanupErr);
        }

        if (opErr.code === 11000) {
          return res.status(409).json({ message: "Member already exists for this join request" });
        }
        throw opErr;
      }
    }

    return res.status(200).json({
      message: "Join request approved successfully",
      join: joinRequest,
      member: newMember,
    });
  } catch (error) {
    console.error("Error in quickApprove:", error);
    return res.status(500).json({
      message: "Error processing quick approve",
      error: error.message,
    });
  }
};
