const express = require("express");
const router = express.Router();

const gymController = require("../controller/gymController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", gymController.listGyms);

router.get("/:id", gymController.getGymDetails);

router.get("/owner/:userId", authMiddleware, gymController.getGymsByOwner);

module.exports = router;
