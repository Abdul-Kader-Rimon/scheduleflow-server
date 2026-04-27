const express = require('express');
const router = express.Router();
const { createSlot, getTeacherSlots, bookSlot, getAvailableSlots, getTeacherBookedSlots, getAllSlots } = require('../controllers/slotController');


router.post('/create', createSlot);


router.get('/teacher/:teacherId', getTeacherSlots);
router.get('/available', getAvailableSlots);
router.post('/book', bookSlot);
router.get('/teacher/:teacherId/booked', getTeacherBookedSlots);
router.get('/all', getAllSlots);
module.exports = router;