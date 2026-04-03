const express = require("express");
const healthRouter = require("./health.routes");
const meetingRouter = require("./meeting.routes");
const workspaceRouter = require("./workspace.routes");
const userRouter = require("./user.routes");

const router = express.Router();

router.use("/health", healthRouter);
router.use("/meetings", meetingRouter);
router.use("/workspace", workspaceRouter);
router.use("/user", userRouter);

module.exports = router;

