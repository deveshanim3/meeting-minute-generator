const { admin } = require("../config/firebase");

/**
 * PATCH /api/v1/user/profile
 * Updates the current user's profile (display name).
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { displayName } = req.body;
    const uid = req.uid;

    if (!displayName || typeof displayName !== "string") {
      return res.status(400).json({ success: false, message: "Valid displayName is required" });
    }

    // Update the user profile in Firebase Auth
    const userRecord = await admin.auth().updateUser(uid, {
      displayName: displayName.trim(),
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
  }
};
