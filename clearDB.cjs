// clearDB.cjs
const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://srinivasraob03_db_user:0QOzVDjTy8RxexBu@vmc.zbmlk3y.mongodb.net/?appName=VMC";

async function clearDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    const dbName = mongoose.connection.db.databaseName;
    console.log(`📂 Current database: ${dbName}`);

    // Drop the database completely
    await mongoose.connection.db.dropDatabase();
    console.log("🗑️  Database cleared successfully!");

    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  }
}

clearDatabase();
