const mongoose = require("mongoose");
const Member = require("../models/Member");
const Join = require("../models/joinSchema");
const User = require("../models/User");
const Gym = require("../models/GymSchema");

// Update your existing addMember method in memberController.js
exports.addMember = async (req, res) => {
  try {
    const { joinRequestId, membershipDetails } = req.body;

    console.log("Adding member with joinRequestId:", joinRequestId);
    console.log("Membership details:", membershipDetails);

    // Find the join request to get user and gym info
    const joinRequest = await Join.findById(joinRequestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    // Check if member already exists for this join request
    let member = await Member.findOne({ joinRequestId: joinRequestId });

    if (member) {
      // Update existing member
      member.memberShipPlan =
        membershipDetails.memberShipPlan || member.memberShipPlan;
      member.healthInfo = membershipDetails.healthInfo || member.healthInfo;
      member.measurements =
        membershipDetails.measurements || member.measurements;
      member.exercisePlan =
        membershipDetails.exercisePlan || member.exercisePlan;

      await member.save();

      console.log("Updated existing member:", member._id);
      return res.json({
        message: "Member updated successfully",
        member: member,
      });
    } else {
      // Create new member
      const newMember = new Member({
        joinRequestId: joinRequestId,
        user: joinRequest.member, // ✅ FIXED
        gym: joinRequest.gym, // ✅ FIXED
        memberShipPlan: membershipDetails.memberShipPlan,
        healthInfo: membershipDetails.healthInfo,
        measurements: membershipDetails.measurements,
        exercisePlan: membershipDetails.exercisePlan,
        status: "active",
      });

      await newMember.save();

      // Optionally update join request status
      joinRequest.status = "approved";
      await joinRequest.save();

      console.log("Created new member:", newMember._id);
      return res.status(201).json({
        message: "Member created successfully",
        member: newMember,
      });
    }
  } catch (error) {
    console.error("Error in addMember:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getGymMembers = async (req, res) => {
  try {
    const gymId = req.query.gymId;
    const userId = req.user.userId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "Gym ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(gymId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Gym ID",
      });
    }

    const gym = await Gym.findById(gymId);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    // Verify gym ownership
    if (gym.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const members = await Join.find({
      gym: gym._id,
      status: { $ne: "rejected" },
    })
      .populate("member", "name email")
      // .populate("memberShipPlan")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        members,
        total: members.length,
      },
    });
  } catch (error) {
    console.error("Get Members Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching members",
      error: error.message,
    });
  }
};

exports.getJoinRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    console.log("Fetching requests for user:", userId, "with role:", userRole);

    if (userRole === "member") {
      // For members, fetch their own join requests
      const joinRequests = await Join.find({ member: userId })
        .populate("member", "name email")
        .populate("gym", "name")
        .sort({ createdAt: -1 });

      return res.json(joinRequests);
    }

    // For gym owners, directly use the gym's owner ID in the query
    const joinRequests = await Join.find({ "gym.owner": userId })
      .populate({
        path: "member",
        select: "name email",
      })
      .populate("gym", "name")
      .sort({ createdAt: -1 });

    console.log("Gym owner requests:", joinRequests);
    res.json(joinRequests);
  } catch (error) {
    console.error("Error in getJoinRequests:", error);
    res.status(500).json({
      message: "Error fetching join requests",
      error: error.message,
    });
  }
};

exports.getMemberStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing",
      });
    }

    const memberDetails = await Member.findOne({ user: userId })
      .populate("gym", "name")
      .populate("user", "name email");

    if (!memberDetails) {
      const joinRequest = await Join.findOne({ member: userId })
        .populate("gym", "name")
        .populate("member", "name email");

      if (!joinRequest) {
        return res.status(404).json({
          success: false,
          message: "No membership found",
        });
      }

      return res.json({
        success: true,
        data: {
          status: joinRequest.status,
          gymName: joinRequest.gym.name,
          member: {
            name: joinRequest.member.name,
            email: joinRequest.member.email,
          },
        },
      });
    }

    res.json({
      success: true,
      data: {
        status: "active",
        gymName: memberDetails.gym.name,
        planName: memberDetails.memberShipPlan.name,
        startDate: memberDetails.memberShipPlan.startDate,
        endDate: memberDetails.memberShipPlan.endDate,
        member: {
          name: memberDetails.user.name,
          email: memberDetails.user.email,
        },
        exercisePlan: memberDetails.exercisePlan || {},
        dietPlan: memberDetails.dietPlan || [],
        measurements: memberDetails.measurements || {},
        healthInfo: memberDetails.healthInfo || {},
      },
    });
  } catch (error) {
    console.error("Get Member Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching member status",
    });
  }
};

exports.updateMemberStatus = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status, reason } = req.body;
    const { userId, role } = req.user;

    const validStatuses = ["active", "inactive", "suspended"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    let member = await Member.findById(memberId)
      .populate("gym")
      .populate("user", "email name");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (role !== "admin" && member.gym.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const oldStatus = member.status;
    member.status = status;

    if (!member.statusHistory) {
      member.statusHistory = [];
    }

    member.statusHistory.push({
      from: oldStatus,
      to: status,
      changedBy: userId,
      reason: reason || "",
      date: new Date(),
    });

    await member.save();

    if (status === "suspended") {
      console.log(`Member ${member.user.email} has been suspended`);
    }

    res.json({
      success: true,
      message: `Member status updated to ${status}`,
      data: {
        memberId: member._id,
        status: member.status,
        updatedAt: member.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating member status",
      error: error.message,
    });
  }
};

exports.updateExercisePlan = async (req, res) => {
  try {
    const { memberId, exercisePlan } = req.body;
    const gymOwnerId = req.user.userId;

    const member = await Member.findById(memberId).populate("gym");

    if (!member || member.gym.owner.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access or member not found",
      });
    }

    // Validate and process exercise plan
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const processedPlan = {};

    for (const day of days) {
      if (exercisePlan[day]) {
        // Validate exercises for this day
        for (const exercise of exercisePlan[day].exercises) {
          if (
            !exerciseCategories[exercise.muscleGroup]?.includes(exercise.name)
          ) {
            return res.status(400).json({
              success: false,
              message: `Invalid exercise '${exercise.name}' for muscle group '${exercise.muscleGroup}'`,
            });
          }
        }

        // Process and format the day's exercises
        processedPlan[day] = {
          exercises: exercisePlan[day].exercises.map((exercise) => ({
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            sets: Number(exercise.sets),
            reps: Number(exercise.reps),
            weight: Number(exercise.weight || 0),
            duration: Number(exercise.duration || 0),
            restBetweenSets: Number(exercise.restBetweenSets || 60),
            notes: exercise.notes || "",
            progression: exercise.progression || [],
          })),
          notes: exercisePlan[day].notes || "",
          duration: Number(exercisePlan[day].duration || 0),
        };
      }
    }

    member.exercisePlan = processedPlan;
    await member.save();

    res.json({
      success: true,
      message: "Exercise plan updated successfully",
      exercisePlan: member.exercisePlan,
    });
  } catch (error) {
    console.error("Update Exercise Plan Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating exercise plan",
      error: error.message,
    });
  }
};

exports.getExerciseCategories = async (req, res) => {
  try {
    res.json({
      success: true,
      categories: exerciseCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching exercise categories",
    });
  }
};

exports.updateDietPlan = async (req, res) => {
  try {
    const { memberId, dietPlan } = req.body;
    const gymOwnerId = req.user.userId;

    const member = await Member.findById(memberId).populate("gym");

    if (!member || member.gym.owner.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access or member not found",
      });
    }

    member.dietPlan = dietPlan;
    await member.save();

    res.json({
      success: true,
      message: "Diet plan updated successfully",
      dietPlan: member.dietPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating diet plan",
    });
  }
};

exports.updateMeasurements = async (req, res) => {
  try {
    const { memberId, measurements } = req.body;
    const gymOwnerId = req.user.userId;

    const member = await Member.findById(memberId).populate("gym");

    if (!member || member.gym.owner.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access or member not found",
      });
    }

    member.measurements.push(measurements);
    await member.save();

    res.json({
      success: true,
      message: "Measurements updated successfully",
      measurements: member.measurements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating measurements",
    });
  }
};
exports.getMemberById = async (req, res) => {
  try {
    const memberId = req.params.id;
    const userId = req.user.userId;

    const member = await Member.findById(memberId)
      .populate("user", "name email")
      .populate("gym", "name owner");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No member details found for this ID",
      });
    }

    // Optional: Ensure the requesting user is the gym owner
    if (member.gym.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this member's data",
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching member details",
    });
  }
};

exports.getMemberByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const member = await Member.findOne({ user: userId })
      .populate("user", "name email")
      .populate("gym", "name owner");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No member found for this user",
      });
    }

    // Optional ownership check:
    if (member.gym.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this member's data",
      });
    }

    res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("getMemberByUserId error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching member",
    });
  }
};
// In your memberController.js
// Add this method to your memberController.js
exports.getMemberByJoinRequestId = async (req, res) => {
  try {
    const { joinRequestId } = req.params;

    console.log("Looking for member with joinRequestId:", joinRequestId);

    // Find member by joinRequestId
    const member = await Member.findOne({ joinRequestId: joinRequestId });

    if (!member) {
      return res.status(404).json({
        message: "Member not found for this join request",
        joinRequestId: joinRequestId,
      });
    }

    // Transform the data to match what your React component expects
    const responseData = {
      membershipDetails: {
        memberShipPlan: member.memberShipPlan,
        healthInfo: member.healthInfo,
        measurements: member.measurements,
        exercisePlan: member.exercisePlan,
      },
    };

    console.log("Found member:", member._id);
    res.json(responseData);
  } catch (error) {
    console.error("Error in getMemberByJoinRequestId:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
