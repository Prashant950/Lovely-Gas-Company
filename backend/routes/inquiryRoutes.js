// routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/auth');

// Public / Authenticated: submit an inquiry
router.post('/', createInquiry);

// User: fetch my inquiries
router.get('/my', protect, getMyInquiries);

// Admin: manage inquiries
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id', protect, adminOnly, updateInquiry);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
