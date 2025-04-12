const mongoose = require("mongoose");

const staffScheduleSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shifts: [{ day: String, startTime: String, endTime: String }],
  availability: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true,
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.StaffSchedule || mongoose.model("StaffSchedule", staffScheduleSchema);