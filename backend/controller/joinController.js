const Join = require("../models/joinSchema");
const User = require("../models/User");
const Gym = require("../models/GymSchema");

exports.joinRequest = async (req, res) => {
    try {
        const {gymId} = req.body;
        const memberId = req.user.id;

        const existingRequest = await await Join.findOne({member: memberId, gym: gymId});
       
        if(existingRequest){
            return res.status(400).json({message: "Request already sent"});
        }

        const joinRequest = new Join({
            member: memberId,
            gym: gymId,
            status: "pending"
        })

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


exports.processJoinRequest = async(req,res)=>{
    try {

        const {requestId, status} = req.body;
        const gymOwnerId = req.user.userId;

        const joinRequest = await Join.findById(requestId).populate('gym').populate('member');

        if(!joinRequest){
            return res.status(400).json({message: "Request not found"});
        }

        if(joinRequest.gym.owner.toString() !== gymOwnerId){
            return res.status(403).json({message: "Unauthorized"});
        }

        joinRequest.status = status;

        await joinRequest.save();

        if(status ==="approved"){
            await User.findByIdAndUpdate(joinRequest.member._id, {
                gym: joinRequest.gym._id
            });
        }
        
        res.json({
            message:`Join Request ${status}
            `,
            requestId:joinRequest._id
        })
    } catch (error) {
        res.status(500).json({message: "Error processing request"});
        
    }
};

exports.getJoinRequests = async(req,res)=>{
    try {
        const gymOwnerId = req.user.userId;

        const gym = await Gym.findOne({owner: gymOwnerId});

        if(!gym){
            return res.status(400).json({message: "Gym not found"});
        }

        const joinRequests = await Join.find({
            gym: gym._id
        }).populate('member', 'name email');

        res.json(joinRequests);
        
    } catch (error) {
        res.status(500).json({message: "Error fetching join requests"});
        
    }
}