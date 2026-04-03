const admin = require("firebase-admin");
const { env } = require("./env");

if (!admin.apps.length) {
  try {
    if (env.firebaseServiceAccount) {
      const path = require("path");
      const serviceAccountPath = path.resolve(process.cwd(), env.firebaseServiceAccount);
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: env.firebaseStorageBucket || `${serviceAccount.project_id}.firebasestorage.app`,
      });
      console.log("Firebase Admin initialized with Service Account");
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT is not set in .env.");
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
  }
}

const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;
const bucket = admin.apps.length ? admin.storage().bucket() : null;

module.exports = { admin, db, auth, bucket };
