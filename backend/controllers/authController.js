// controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

// POST /api/auth/register (public)
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    throw appError('Name, email, and password are required', 400);
  }

  if (password.length < 6) {
    throw appError('Password must be at least 6 characters', 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw appError('An account with this email already exists', 400);
  }

  const userRole = role && ['admin', 'user'].includes(role.toLowerCase().trim())
    ? role.toLowerCase().trim()
    : 'user';

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone ? phone.trim() : '',
    role: userRole,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    message: 'Account created successfully!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

// POST /api/auth/login (public)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw appError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw appError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

// POST /api/auth/forgot-password (public) - Send OTP via Email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw appError('Please provide your registered email address', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw appError('No account found with this email address', 404);
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = expires;
  await user.save({ validateBeforeSave: false });

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 25px; border-radius: 16px; background-color: #ffffff; border: 1px solid #e2e8f0; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #00264d; margin: 0; font-size: 24px;">Lovely Gas Company</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Password Reset Verification</p>
      </div>

      <p style="font-size: 15px; margin-bottom: 16px;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        You recently requested to reset your password for Lovely Gas Company. Use the 6-digit OTP below to verify your account and set a new password:
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #f5a623; background-color: #00264d; padding: 14px 28px; border-radius: 12px;">
          ${otp}
        </span>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">(This OTP is valid for 10 minutes)</p>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #64748b;">
        If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>

      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin: 0;">
        Lovely Gas Company & Home Appliance Service Provider<br/>Greater Noida West, Uttar Pradesh
      </p>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: `Your Password Reset OTP: ${otp} - Lovely Gas Company`,
      text: `Your OTP for Lovely Gas Company password reset is ${otp}. Valid for 10 minutes.`,
      html,
    });

    res.json({
      success: true,
      message: `OTP sent successfully to ${user.email}. Please check your inbox.`,
    });
  } catch (err) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw appError(`Failed to send email: ${err.message}`, 500);
  }
});

// POST /api/auth/reset-password (public) - Verify OTP and update password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw appError('Email, OTP, and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw appError('New password must be at least 6 characters', 400);
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    resetPasswordOtp: otp.toString().trim(),
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordOtp +resetPasswordExpires');

  if (!user) {
    throw appError('Invalid or expired OTP. Please request a new one.', 400);
  }

  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully! You can now log in with your new password.',
  });
});

// GET /api/auth/me (protect)
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile (protect)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw appError('User not found', 404);

  const { name, phone, password, currentPassword, role } = req.body;

  if (name) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (role && ['admin', 'user'].includes(role.toLowerCase().trim())) {
    user.role = role.toLowerCase().trim();
  }

  if (password) {
    if (password.length < 6) {
      throw appError('New password must be at least 6 characters', 400);
    }
    if (currentPassword) {
      const userWithPass = await User.findById(req.user._id).select('+password');
      if (!(await userWithPass.matchPassword(currentPassword))) {
        throw appError('Current password does not match', 400);
      }
    }
    user.password = password;
  }

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
};
