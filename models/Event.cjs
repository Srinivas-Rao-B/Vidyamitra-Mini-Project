const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  department: String,
  name: String,
  date: String,
});

module.exports = mongoose.model("Event", eventSchema);
