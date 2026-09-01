// controllers/inquiryController.js
const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');

// POST /api/inquiries  (public or authenticated) -> 201 { inquiry, message }
const createInquiry = asyncHandler(async (req, res) => {
  const { name, phone, email, serviceName, message, source, address, preferredDate } = req.body;

  if (!name || !phone) {
    throw appError('Name and phone are required', 400);
  }

  const userId = req.user ? req.user._id : req.body.userId || undefined;

  const inquiry = await Inquiry.create({
    user: userId,
    name,
    phone,
    email: email || (req.user ? req.user.email : undefined),
    serviceName,
    message,
    address,
    preferredDate,
    source: source || (req.user ? 'user-portal' : 'contact-form'),
  });

  res.status(201).json({ inquiry, message: 'Inquiry received' });
});

// GET /api/inquiries/my  (authenticated user) -> { inquiries }
const getMyInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({
    $or: [{ user: req.user._id }, { email: req.user.email }],
  }).sort({ createdAt: -1 });

  res.json({ inquiries });
});

// GET /api/inquiries  (admin) -> { inquiries } newest first
const getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json({ inquiries });
});

// PUT /api/inquiries/:id  (admin) -> { inquiry }
const updateInquiry = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!inquiry) throw appError('Inquiry not found', 404);
  res.json({ inquiry });
});

// DELETE /api/inquiries/:id  (admin) -> { message }
const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) throw appError('Inquiry not found', 404);
  res.json({ message: 'Inquiry deleted' });
});

module.exports = {
  createInquiry,
  getMyInquiries,
  getInquiries,
  updateInquiry,
  deleteInquiry,
};
