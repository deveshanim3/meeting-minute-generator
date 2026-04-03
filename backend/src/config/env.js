const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "",
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT || "",
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  groqApiKey: process.env.GROQ_API_KEY || "",
};

module.exports = { env };
