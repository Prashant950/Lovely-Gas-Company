// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// Every user route requires an authenticated admin.
router.use(protect, adminOnly);

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
