const express = require('express');
const router = express.Router();
const { createSlot, getTeacherSlots } = require('../controllers/slotController');


router.post('/create', createSlot);


router.get('/teacher/:teacherId', getTeacherSlots);

module.exports = router;