// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const appError = require('../utils/appError');

// POST /api/upload - Admin upload image to Cloudinary
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw appError('No image file uploaded', 400);
    }

    // Upload buffer to Cloudinary using stream
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'lovely_gas_services',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadStream();

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  })
);

module.exports = router;
