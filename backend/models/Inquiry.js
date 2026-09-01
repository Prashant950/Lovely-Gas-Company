// models/Inquiry.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    serviceName: { type: String },
    message: { type: String },
    preferredDate: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'resolved', 'cancelled'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['contact-form', 'whatsapp', 'inquiry-now', 'user-portal'],
      default: 'contact-form',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
