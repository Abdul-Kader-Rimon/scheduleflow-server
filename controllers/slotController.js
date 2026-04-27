const Slot = require('../models/Slot');

 
const createSlot = async (req, res) => {
  try {
    const { teacherId, date, startTime, duration } = req.body;

    
    const slotDateTime = new Date(`${date}T${startTime}`);
    if (slotDateTime < new Date()) {
      return res.status(400).json({ message: "Cannot create slots for past dates or times!" });
    }

 
    const end = new Date(slotDateTime.getTime() + duration * 60000);
    const endTime = end.toTimeString().split(' ')[0].substring(0, 5);

   
    const overlapping = await Slot.findOne({
      teacherId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: "A slot already exists within this time range!" });
    }

    const newSlot = new Slot({
      teacherId,
      date,
      startTime,
      endTime,
      status: 'Available'
    });

    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (err) {
    res.status(500).json({ message: "Error occurred while creating the slot!" });
  }
};

// টিচারের সব স্লট দেখা
const getTeacherSlots = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const slots = await Slot.find({ teacherId }).sort({ date: 1, startTime: 1 });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: "Error occurred while fetching slot data!" });
  }
};

module.exports = {
  createSlot,
  getTeacherSlots
};