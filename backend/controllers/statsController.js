// controllers/statsController.js
const Service = require('../models/Service');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/stats  (admin) -> { stats }
const getStats = asyncHandler(async (req, res) => {
  const [totalServices, activeServices, totalUsers, totalInquiries, newInquiries] =
    await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      User.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
    ]);

  res.json({
    stats: {
      totalServices,
      activeServices,
      totalUsers,
      totalInquiries,
      newInquiries,
    },
  });
});

module.exports = { getStats };
