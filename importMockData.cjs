const mongoose = require("mongoose");
const path = require("path");
const { pathToFileURL } = require("url");

const mockDataPath = pathToFileURL(path.join(__dirname, "src/data/mockData.js")).href;

(async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(
      "mongodb+srv://srinivasraob03_db_user:0QOzVDjTy8RxexBu@vmc.zbmlk3y.mongodb.net/vidyamitra"
    );
    console.log("✅ Connected to MongoDB (vidyamitra)");

    const mockData = await import(mockDataPath);
    const { users, db } = mockData;

    const collections = [
      "students",
      "faculties",
      "departments",
      "events",
      "resources",
      "notifications",
      "summaries",
      "users",
    ];
    for (const name of collections) {
      try {
        await mongoose.connection.db.collection(name).dropIndex("id_1");
        console.log(`🧹 Dropped duplicate index on ${name}.id_1`);
      } catch (err) {
        if (!err.message.includes("index not found")) console.warn(err.message);
      }
    }

    const opts = { strict: false };
    const User = mongoose.model("User", new mongoose.Schema({}, opts));
    const Student = mongoose.model("Student", new mongoose.Schema({}, opts));
    const Faculty = mongoose.model("Faculty", new mongoose.Schema({}, opts));
    const Department = mongoose.model("Department", new mongoose.Schema({}, opts));
    const Event = mongoose.model("Event", new mongoose.Schema({}, opts));
    const Resource = mongoose.model("Resource", new mongoose.Schema({}, opts));
    const Notification = mongoose.model("Notification", new mongoose.Schema({}, opts));
    const Summary = mongoose.model("Summary", new mongoose.Schema({}, opts));

    console.log("🧹 Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Faculty.deleteMany({}),
      Department.deleteMany({}),
      Event.deleteMany({}),
      Resource.deleteMany({}),
      Notification.deleteMany({}),
      Summary.deleteMany({}),
    ]);

    // Helper function to remove _id
    const clean = (arr) => arr.map((obj) => {
      const { _id, ...rest } = obj;
      return rest;
    });

    console.log("📦 Inserting users...");
    await User.insertMany(clean(users).map((u, i) => ({ ...u, id: i + 1 })));

    console.log("📦 Inserting students...");
    await Student.insertMany(
      clean(db.departments.AIML.students).map((s, i) => ({ ...s, id: i + 100 }))
    );

    console.log("📦 Inserting faculty...");
    await Faculty.insertMany(
      clean(db.departments.AIML.faculty).map((f, i) => ({ ...f, id: i + 500 }))
    );

    console.log("📦 Inserting departments...");
    const departmentDocs = Object.entries(db.departments).map(([key, val], i) => ({
      id: i + 1000,
      name: key,
      ...val.overview,
    }));
    await Department.insertMany(clean(departmentDocs));

    console.log("📦 Inserting events...");
    const events = Object.entries(db.departmentEvents).flatMap(([dept, list], i) =>
      clean(list).map((ev, j) => ({ id: i * 100 + j, department: dept, ...ev }))
    );
    await Event.insertMany(events);

    console.log("📦 Inserting study resources...");
    const resources = Object.entries(db.studyResources).map(([subject, topics], i) => ({
      id: i + 2000,
      subject,
      topics,
    }));
    await Resource.insertMany(clean(resources));

    console.log("📦 Inserting notifications...");
    await Notification.insertMany(
      clean(db.notifications).map((n, i) => ({ ...n, id: i + 3000 }))
    );

    console.log("📦 Inserting summaries...");
    await Summary.insertMany(
      clean(db.summaries).map((s, i) => ({ ...s, id: i + 4000 }))
    );

    console.log("✅ Data import complete!");
  } catch (err) {
    console.error("❌ Error importing data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
})();
