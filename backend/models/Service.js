// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String },
    shortDescription: { type: String }, // one-liner shown on cards
    description: { type: String }, // long details
    category: { type: String, default: 'General' },
    imageUrl: { type: String },
    icon: { type: String }, // optional emoji / icon name
    features: [{ type: String }], // list of what's included
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate a slug from the title when one is not supplied.
serviceSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
