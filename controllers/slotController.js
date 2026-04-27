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
      return res.status(400).json({ message: "This slot overlaps with an existing schedule!" });
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
    res.status(500).json({ message: "Server error occurred!" });
  }
};

 
const getTeacherSlots = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const slots = await Slot.find({ teacherId }).sort({ date: 1, startTime: 1 });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: "Error occurred while fetching slot data!" });
  }
};
const bookSlot = async (req, res) => {
  try {
    const { slotId, studentId, studentName } = req.body;  

    const slot = await Slot.findById(slotId);

    if (!slot) return res.status(404).json({ message: "Slot not found!" });
    if (slot.status === 'Booked') return res.status(400).json({ message: "Already booked!" });

     
    slot.status = 'Booked';
    slot.studentId = studentId;
    slot.bookedBy = studentName; 
    
    await slot.save();

    res.status(200).json({ message: "Booked successfully!", slot });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const getAvailableSlots = async (req, res) => {
  try {
    
    const slots = await Slot.find({ status: 'Available' })
      .populate('teacherId', 'name email')  
      .sort({ date: 1, startTime: 1 });
      
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available slots" });
  }
};
const getTeacherBookedSlots = async (req, res) => {
  try {
    const { teacherId } = req.params;

    
    const bookedSlots = await Slot.find({ 
      teacherId: teacherId, 
      status: 'Booked' 
    })
    .populate('studentId', 'name email')  
    .sort({ date: 1, startTime: 1 });

    res.status(200).json(bookedSlots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booked slots" });
  }
};
const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find({})
      .populate('teacherId', 'name email')
      .populate('studentId', 'name email')  
      .sort({ date: 1, startTime: 1 });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all slots" });
  }
};

module.exports = {
  createSlot,
  getTeacherSlots,
  bookSlot,
  getAvailableSlots,
  getTeacherBookedSlots,
  getAllSlots,
};