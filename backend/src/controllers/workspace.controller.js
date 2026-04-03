const { db } = require("../config/firebase");

/**
 * GET /api/v1/workspace/members — list workspace members for current user
 */
exports.listMembers = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: "Firebase not configured" });
    }

    const snapshot = await db.collection("workspace_members")
      .where("ownerUid", "==", req.uid)
      .get();
    const members = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const aTime = a.joinedAt?._seconds || 0;
        const bTime = b.joinedAt?._seconds || 0;
        return bTime - aTime;
      });

    return res.json({ success: true, members });
  } catch (error) {
    console.error("Error listing members:", error);
    next(error);
  }
};

/**
 * POST /api/v1/workspace/invite — invite a member by email (scoped to current user)
 */
exports.inviteMember = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: "Firebase not configured" });
    }

    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if member already exists in this user's workspace
    const existing = await db.collection("workspace_members")
      .where("ownerUid", "==", req.uid)
      .where("email", "==", email)
      .get();
    if (!existing.empty) {
      return res.status(409).json({ success: false, message: "Member already exists in your workspace" });
    }

    const memberData = {
      ownerUid: req.uid,
      name: email.split("@")[0],
      email,
      role: role || "viewer",
      status: "invited",
      joinedAt: new Date(),
    };

    const docRef = await db.collection("workspace_members").add(memberData);

    return res.status(201).json({
      success: true,
      message: `Invitation sent to ${email}`,
      member: { id: docRef.id, ...memberData },
    });
  } catch (error) {
    console.error("Error inviting member:", error);
    next(error);
  }
};

/**
 * PATCH /api/v1/workspace/members/:id — update member role (only if owned by user)
 */
exports.updateMemberRole = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: "Firebase not configured" });
    }

    const { role } = req.body;
    const { id } = req.params;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const docRef = db.collection("workspace_members").doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().ownerUid !== req.uid) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    await docRef.update({ role });

    return res.json({
      success: true,
      message: "Role updated",
      member: { id: doc.id, ...doc.data(), role },
    });
  } catch (error) {
    console.error("Error updating member role:", error);
    next(error);
  }
};

/**
 * DELETE /api/v1/workspace/members/:id — remove a member (only if owned by user)
 */
exports.removeMember = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: "Firebase not configured" });
    }

    const { id } = req.params;
    const docRef = db.collection("workspace_members").doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().ownerUid !== req.uid) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    await docRef.delete();

    return res.json({ success: true, message: "Member removed" });
  } catch (error) {
    console.error("Error removing member:", error);
    next(error);
  }
};
