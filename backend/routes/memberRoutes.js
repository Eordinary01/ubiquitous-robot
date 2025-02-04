const express = require("express");
const router = express.Router();
const memberController = require("../controller/memberController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, memberController.addMember);

// gym owner fetches all members of their gym

router.get("/gym-members", authMiddleware, memberController.getGymMembers);

router.put("/update-status", authMiddleware, memberController.updateMemberStatus);
router.put(
  "/exercise-plan",
  authMiddleware,
  memberController.updateExercisePlan
);
router.get(
  "/exercise-categories",
  authMiddleware,
  memberController.getExerciseCategories
);

router.put("/diet-plan", authMiddleware, memberController.updateDietPlan);

router.put(
  "/measurements",
  authMiddleware,
  memberController.updateMeasurements
);

module.exports = router;
