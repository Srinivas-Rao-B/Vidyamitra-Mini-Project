const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  usn: String,
  email: String,
  password: String,
  role: { type: String, default: "student" },
  department: String,
  section: String,
  semester: Number,
  phone: String,
  fatherName: String,
  fatherPhone: String,
  seatAllotment: String,
  accommodation: String,
  transport: String,
  fees: Array,
  performance: Array,
  classAverage: Array,
  overallAttendance: Number,
});

module.exports = mongoose.model("Student", studentSchema);
