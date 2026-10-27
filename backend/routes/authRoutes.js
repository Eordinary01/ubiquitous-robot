const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { loginRateLimiter } = require("../middleware/rateLimiter");

router.post("/register", authController.register);

router.post("/login", loginRateLimiter, authController.login);

router.get("/verify", authMiddleware, authController.verifyToken);

module.exports = router;