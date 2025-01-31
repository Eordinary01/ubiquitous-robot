const express = require("express");
const router = express.Router();
const joinController = require("../controller/joinController");
const authMiddleware = require("../middleware/authMiddleware");

// member requests to join a gym
router.post('/request',authMiddleware, joinController.joinRequest);

// gym owner processes a join request
router.post('/process',authMiddleware, joinController.processJoinRequest);

// gym owner fetches all join requests for their gym
router.get('/requests',authMiddleware, joinController.getJoinRequests); 

module.exports = router;