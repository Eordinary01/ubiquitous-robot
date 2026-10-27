const express = require("express");
const router = express.Router();

const gymController = require("../controller/gymController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", gymController.listGyms);

router.get("/:id", gymController.getGymDetails);

router.get("/owner/:userId", authMiddleware, gymController.getGymsByOwner);
router.get("/owner", authMiddleware, gymController.getGymsByOwner);

router.put("/:id/branding", authMiddleware, gymController.updateGymBranding);

module.exports = router;
