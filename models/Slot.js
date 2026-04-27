const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, 
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true },
  duration: { type: Number, default: 15 },
 status: { type: String, default: 'Available' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookedBy: { type: String }
}, { timestamps: true,
    versionKey: false
 });

module.exports = mongoose.model('Slot', slotSchema);