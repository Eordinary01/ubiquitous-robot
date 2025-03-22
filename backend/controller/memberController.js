const mongoose = require("mongoose");
const Member = require("../models/Member");
const Join = require("../models/joinSchema");
const User = require("../models/User");
const Gym = require("../models/GymSchema");

exports.addMember = async (req, res) => {
  try {
    const { joinRequestId, membershipDetails } = req.body;
    const gymOwnerId = req.user.userId;

    const joinRequest = await Join.findById(joinRequestId)
      .populate({
        path: "member",
        select: "name email",
      })
      .populate("gym");

    if (!joinRequest) {
      return res.status(400).json({
        success: false,
        message: "Request not found",
      });
    }

    if (joinRequest.gym.owner.toString() !== gymOwnerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (joinRequest.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Join request must be approved first!!",
      });
    }

    let endDate = new Date();

    switch (membershipDetails.duration) {
      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "Quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "Annual":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Process measurements
    const measurements = membershipDetails.measurements
      ? {
          ...membershipDetails.measurements,
          weight: Number(membershipDetails.measurements.weight),
          height: Number(membershipDetails.measurements.height),
          chest: Number(membershipDetails.measurements.chest),
          waist: Number(membershipDetails.measurements.waist),
          hips: Number(membershipDetails.measurements.hips),
          biceps: Number(membershipDetails.measurements.biceps),
          thighs: Number(membershipDetails.measurements.thighs),
          bodyFatPercentage: Number(
            membershipDetails.measurements.bodyFatPercentage
          ),
          bmi: Number(membershipDetails.measurements.bmi),
          date: new Date(membershipDetails.measurements.date),
        }
      : undefined;

    // Process exercise plan
    const exercisePlan = {};
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (membershipDetails.exercisePlan) {
      days.forEach((day) => {
        if (membershipDetails.exercisePlan[day]) {
          exercisePlan[day] = {
            exercises: membershipDetails.exercisePlan[day].exercises.map(
              (exercise) => ({
                name: exercise.name,
                muscleGroup: exercise.muscleGroup,
                sets: Number(exercise.sets),
                reps: Number(exercise.reps),
                weight: Number(exercise.weight || 0),
                duration: Number(exercise.duration || 0),
                restBetweenSets: Number(exercise.restBetweenSets || 60),
                notes: exercise.notes || "",
                progression: [],
              })
            ),
            notes: membershipDetails.exercisePlan[day].notes || "",
            duration: Number(membershipDetails.exercisePlan[day].duration || 0),
          };
        }
      });
    }

    const member = new Member({
      user: joinRequest.member._id,
      gym: joinRequest.gym._id,
      memberShipPlan: {
        name: membershipDetails.name,
        duration: membershipDetails.duration,
        startDate: new Date(),
        endDate: endDate,
        price: membershipDetails.price,
      },
      healthInfo: membershipDetails.healthInfo,
      measurements: measurements,
      exercisePlan: exercisePlan,
    });

    await member.save();

    await User.findByIdAndUpdate(joinRequest.member._id, {
      role: "member",
      gym: joinRequest.gym._id,
    });

    res.status(201).json({
      success: true,
      message: "Member Added Successfully",
      member,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Adding Member!!",
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
                message: "User ID is missing"
            });
        }

        const memberDetails = await Member.findOne({ user: userId })
            .populate('gym', 'name')
            .populate('user', 'name email');

        if (!memberDetails) {
            const joinRequest = await Join.findOne({ member: userId })
                .populate('gym', 'name')
                .populate('member', 'name email');

            if (!joinRequest) {
                return res.status(404).json({
                    success: false,
                    message: "No membership found"
                });
            }

            return res.json({
                success: true,
                data: {
                    status: joinRequest.status,
                    gymName: joinRequest.gym.name,
                    member: {
                        name: joinRequest.member.name,
                        email: joinRequest.member.email
                    }
                }
            });
        }

        res.json({
            success: true,
            data: {
                status: 'active',
                gymName: memberDetails.gym.name,
                planName: memberDetails.memberShipPlan.name,
                startDate: memberDetails.memberShipPlan.startDate,
                endDate: memberDetails.memberShipPlan.endDate,
                member: {
                    name: memberDetails.user.name,
                    email: memberDetails.user.email
                },
                exercisePlan: memberDetails.exercisePlan || {},
                dietPlan: memberDetails.dietPlan || [],
                measurements: memberDetails.measurements || {},
                healthInfo: memberDetails.healthInfo || {}
            }
        });

    } catch (error) {
        console.error('Get Member Status Error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching member status"
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

        const member = await Member.findById(memberId)
            .populate('gym');

        if (!member || member.gym.owner.toString() !== gymOwnerId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access or member not found"
            });
        }

        // Validate and process exercise plan
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const processedPlan = {};

        for (const day of days) {
            if (exercisePlan[day]) {
                // Validate exercises for this day
                for (const exercise of exercisePlan[day].exercises) {
                    if (!exerciseCategories[exercise.muscleGroup]?.includes(exercise.name)) {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid exercise '${exercise.name}' for muscle group '${exercise.muscleGroup}'`
                        });
                    }
                }

                // Process and format the day's exercises
                processedPlan[day] = {
                    exercises: exercisePlan[day].exercises.map(exercise => ({
                        name: exercise.name,
                        muscleGroup: exercise.muscleGroup,
                        sets: Number(exercise.sets),
                        reps: Number(exercise.reps),
                        weight: Number(exercise.weight || 0),
                        duration: Number(exercise.duration || 0),
                        restBetweenSets: Number(exercise.restBetweenSets || 60),
                        notes: exercise.notes || '',
                        progression: exercise.progression || []
                    })),
                    notes: exercisePlan[day].notes || '',
                    duration: Number(exercisePlan[day].duration || 0)
                };
            }
        }

        member.exercisePlan = processedPlan;
        await member.save();

        res.json({
            success: true,
            message: "Exercise plan updated successfully",
            exercisePlan: member.exercisePlan
        });
    } catch (error) {
        console.error('Update Exercise Plan Error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating exercise plan",
            error: error.message
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
