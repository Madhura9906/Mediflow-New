const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  experience: Number,
  consultationFee: Number,
  availableTimings: [String]
});

module.exports = mongoose.model("Doctor", doctorSchema);