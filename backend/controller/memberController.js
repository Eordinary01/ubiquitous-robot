const Member = require("../models/Member");
const Join = require("../models/joinSchema");
const User = require("../models/User");
const Gym = require("../models/GymSchema");


exports.addMember = async(req,res)=>{
    try {
        const{joinRequestId, membershipDetails} = req.body;
        const gymOwnerId = req.user.userId;

        const joinRequest = await Join.findById(joinRequestId).populate({
            path:'member',
            select:'name email'
        })
        .populate('gym');

        if(!joinRequest){
            return res.status(400).json({
                success: false,
                message: "Request not found"});
        }

        if(joinRequest.gym.owner.toString() !== gymOwnerId){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"});
        }
        if(joinRequest.status !== "approved"){
            return res.status(400).json({
                success: false,
                message: "Join reqquest ,ust be approved first!!"});
        }

        let endDate = new Date();

        switch(membershipDetails.duration){
            case'Monthly':
            endDate.setMonth(endDate.getMonth()+1);
            break;
            case'Quarterly':
            endDate.setMonth(endDate.getMonth()+3);
            break;
            case'Annual':
            endDate.setFullYear(endDate.getFullYear()+1);
            break;
        }

        const  member = new Member({
            user: joinRequest.member._id,
            gym: joinRequest.gym._id,
            memberShipPlan:{
                name: membershipDetails.name,
                duration: membershipDetails.duration,
                startDate: new Date(),
                endDate: endDate,
                price: membershipDetails.price
            },
            healthInfo: membershipDetails.healthInfo
        });

        await member.save();

        await User.findByIdAndUpdate(joinRequest.member._id,{
            role: "member",
            gym: joinRequest.gym._id
        });

        res.status(201).json({
            success:true,
            message: "Member Added Successfully",
            member
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error Adding Member!!"});
        
    }
};

exports.getGymMembers = async (req, res) => {
    try {
        const { userId, role } = req.user;

        let gym;
        if (role === 'admin' && role === 'gymOwner') {
            
            const { gymId } = req.query;
            if (!gymId) {
                return res.status(400).json({
                    success: false,
                    message: "Gym ID required for admin access"
                });
            }
            gym = await Gym.findById(gymId);
        } else {
            
            gym = await Gym.findOne({ owner: userId });
        }

        if (!gym) {
            return res.status(404).json({
                success: false,
                message: "Gym not found"
            });
        }

       
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const members = await Member.find({ gym: gym._id })
            .populate({
                path: 'user',
                select: 'name email' 
            })
            .select('-healthInfo.medicalConditions -healthInfo.allergies') 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        
        const total = await Member.countDocuments({ gym: gym._id });

        res.json({
            success: true,
            data: {
                members,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalMembers: total,
                    hasMore: page * limit < total
                }
            }
        });
    } catch (error) {
        console.error('Get Members Error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching members",
            error: error.message
        });
    }
};

exports.updateMemberStatus = async (req, res) => {
    try {
        const { memberId } = req.params;
        const { status, reason } = req.body;
        const { userId, role } = req.user;

       
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        let member = await Member.findById(memberId)
            .populate('gym')
            .populate('user', 'email name');

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        
        if (role !== 'admin' && member.gym.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
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
            reason: reason || '',
            date: new Date()
        });

        await member.save();

        
        if (status === 'suspended') {
            
            console.log(`Member ${member.user.email} has been suspended`);
        }

        res.json({
            success: true,
            message: `Member status updated to ${status}`,
            data: {
                memberId: member._id,
                status: member.status,
                updatedAt: member.updatedAt
            }
        });

    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating member status",
            error: error.message
        });
    }
};


exports.updateExercisePlan = async (req, res) => {
    try {
        const { memberId, workoutPlan } = req.body;
        const gymOwnerId = req.user.userId;

        
        for (const workout of workoutPlan) {
            for (const exercise of workout.exercises) {
                if (!exerciseCategories[exercise.muscleGroup]?.includes(exercise.name)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid exercise '${exercise.name}' for muscle group '${exercise.muscleGroup}'`
                    });
                }
            }
        }

        const member = await Member.findById(memberId)
            .populate('gym');

        if (!member || member.gym.owner.toString() !== gymOwnerId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access or member not found"
            });
        }

        member.exercisePlan = workoutPlan;
        await member.save();

        res.json({
            success: true,
            message: "Exercise plan updated successfully",
            exercisePlan: member.exercisePlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating exercise plan",
            
        });
    }
};

exports.getExerciseCategories = async (req, res) => {
    try {
        res.json({
            success: true,
            categories: exerciseCategories
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

        const member = await Member.findById(memberId)
            .populate('gym');

        if (!member || member.gym.owner.toString() !== gymOwnerId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access or member not found"
            });
        }

        member.dietPlan = dietPlan;
        await member.save();

        res.json({
            success: true,
            message: "Diet plan updated successfully",
            dietPlan: member.dietPlan
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

        const member = await Member.findById(memberId)
            .populate('gym');

        if (!member || member.gym.owner.toString() !== gymOwnerId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access or member not found"
            });
        }

        member.measurements.push(measurements);
        await member.save();

        res.json({
            success: true,
            message: "Measurements updated successfully",
            measurements: member.measurements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating measurements",
            
        });
    }
};