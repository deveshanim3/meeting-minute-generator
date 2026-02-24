const mongoose = require("mongoose");
const { env } = require("./env");

const connectDatabase = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it in your .env file.");
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};

module.exports = { connectDatabase };
