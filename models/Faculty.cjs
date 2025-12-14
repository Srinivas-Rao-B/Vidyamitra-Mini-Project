const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  ssn: String,
  name: String,
  department: String,
  designation: String,
  email: String,
  password: String,
  role: { type: String, default: "faculty" },
  allocations: Array,
});

module.exports = mongoose.model("Faculty", facultySchema);
