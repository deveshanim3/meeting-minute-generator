const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  listMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
} = require("../controllers/workspace.controller");

const router = express.Router();

// All workspace routes require authentication
router.use(authMiddleware);

router.get("/members", listMembers);
router.post("/invite", inviteMember);
router.patch("/members/:id", updateMemberRole);
router.delete("/members/:id", removeMember);

module.exports = router;
