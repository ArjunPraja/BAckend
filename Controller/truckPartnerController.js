const express = require('express');
const multer = require('multer');
const path = require('path');
const TruckPartner = require('../Models/TrucPartner'); // Fixed typo here

const router = express.Router();

// Configure Multer with file validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_photos');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Add file validation
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer middleware with file size limits and validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: fileFilter
});

router.post('/upload-profile-photo/:id', upload.single('photo'), async (req, res) => {
  try {
    const partnerId = req.params.id;
    console.log(partnerId);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please provide a photo.' });
    }

    // Store path without leading slash to match your static file serving
    const filePath = `uploads/profile_photos/${req.file.filename}`;

    const updatedPartner = await TruckPartner.findByIdAndUpdate(
      partnerId,
      { t_picture: filePath },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: 'Partner not found with provided ID.' });
    }

    res.status(200).json({
      message: 'Profile photo uploaded successfully.',
      data: updatedPartner
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;