const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { updateProfile } = require("../controllers/user.controller");

const router = express.Router();

// Protect ALL user routes
router.use(authMiddleware);

// PATCH /api/v1/user/profile — update display name
router.patch("/profile", updateProfile);

module.exports = router;
