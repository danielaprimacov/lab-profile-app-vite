const express = require('express');
const router = express.Router();
const User = require('../models/User.model');

const fileUploader = require('../config/cloudinary.config');

const { isAuthenticated } = require('../middleware/jwt.middleware');

router.use(isAuthenticated);

// PUT /api/users
router.put('/users', async (req, res, next) => {
  if (!req.payload) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { username, campus, course, image } = req.body;
  const updateData = {};
  if (username !== undefined) updateData.username = username;
  if (campus !== undefined) updateData.campus = campus;
  if (course !== undefined) updateData.course = course;
  if (image !== undefined) updateData.image = image;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      updateData,
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// GET /api/users
router.get('/users', (req, res, next) => {
  if (!req.payload) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.payload);
});

// POST /api/upload
router.post('/upload', fileUploader.single('image'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ fileUrl: req.file.path });
});

module.exports = router;
