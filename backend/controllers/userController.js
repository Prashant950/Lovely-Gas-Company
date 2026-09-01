// controllers/userController.js  (all routes are admin-only)
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');

// Strip the password field from a user document before returning it.
const sanitize = (userDoc) => {
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  return obj;
};

// GET /api/users -> { users }  (password already select:false)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});

// GET /api/users/:id -> { user }
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw appError('User not found', 404);
  res.json({ user });
});

// POST /api/users -> 201 { user }
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    throw appError('Please provide name, email and password', 400);
  }

  // Use create() so the pre-save hook hashes the password.
  const user = await User.create({ name, email, password, phone, role });

  res.status(201).json({ user: sanitize(user) });
});

// PUT /api/users/:id -> { user }
const updateUser = asyncHandler(async (req, res) => {
  // Select the password so save() has the current hash and required
  // validation passes; it is only re-hashed if a new password is provided.
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw appError('User not found', 404);

  const { name, email, phone, role, password } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = role;
  // Only touch password when a new one is supplied (pre-save re-hashes it).
  if (password) user.password = password;

  await user.save();

  res.json({ user: sanitize(user) });
});

// DELETE /api/users/:id -> { message }
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw appError('User not found', 404);

  // Never allow deleting the last remaining admin.
  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      throw appError('Cannot delete the last admin', 400);
    }
  }

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
