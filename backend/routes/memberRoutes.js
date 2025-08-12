const express = require("express");
const router = express.Router();
const memberController = require("../controller/memberController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/by-user/:userId", authMiddleware, memberController.getMemberByUserId);

// Add this NEW route BEFORE the "/:id" route to avoid conflicts
router.get("/by-join-request/:joinRequestId", authMiddleware, memberController.getMemberByJoinRequestId);

router.post("/add", authMiddleware, memberController.addMember);

// gym owner fetches all members of their gym
router.get("/gym-members", authMiddleware, memberController.getGymMembers);
router.get("/join-requests", authMiddleware, memberController.getJoinRequests);
router.get("/status", authMiddleware, memberController.getMemberStatus);
router.put("/update-status", authMiddleware, memberController.updateMemberStatus);
router.put("/exercise-plan", authMiddleware, memberController.updateExercisePlan);
router.get("/exercise-categories", authMiddleware, memberController.getExerciseCategories);
router.put("/diet-plan", authMiddleware, memberController.updateDietPlan);
router.put("/measurements", authMiddleware, memberController.updateMeasurements);

// Keep this route LAST to avoid conflicts
router.get("/:id", authMiddleware, memberController.getMemberById);

module.exports = router;