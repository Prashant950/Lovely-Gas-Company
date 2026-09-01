// controllers/serviceController.js
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');

// GET /api/services            -> active services only
// GET /api/services?all=true   -> all services (admin dashboards)
// -> { services }
const getServices = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
  res.json({ services });
});

// GET /api/services/:id  (public) -> { service }
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw appError('Service not found', 404);
  res.json({ service });
});

// POST /api/services  (admin) -> 201 { service }
const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ service });
});

// PUT /api/services/:id  (admin) -> { service }
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw appError('Service not found', 404);
  res.json({ service });
});

// DELETE /api/services/:id  (admin) -> { message }
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw appError('Service not found', 404);
  res.json({ message: 'Service deleted' });
});

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
