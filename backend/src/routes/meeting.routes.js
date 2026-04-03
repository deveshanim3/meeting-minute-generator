const express = require("express");
const multer = require("multer");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { generateMinutes, listMeetings, getMeeting } = require("../controllers/meeting.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// All meeting routes require authentication
router.use(authMiddleware);

// GET  /api/v1/meetings      — list user's meetings
router.get("/", listMeetings);

// GET  /api/v1/meetings/:id  — get a single meeting (owned by user)
router.get("/:id", getMeeting);

// POST /api/v1/meetings      — upload file & generate minutes
router.post("/", upload.single("file"), generateMinutes);

module.exports = router;
