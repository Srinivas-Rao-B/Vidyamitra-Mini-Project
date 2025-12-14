const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  head: String,
});

module.exports = mongoose.model("Department", departmentSchema);
