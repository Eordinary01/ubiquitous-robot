const Join = require("../models/joinSchema");
const User = require("../models/User");
const Gym = require("../models/GymSchema");

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
