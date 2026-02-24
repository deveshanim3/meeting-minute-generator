const express = require("express");

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "MeetMind backend is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
