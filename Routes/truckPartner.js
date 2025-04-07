const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');
const TruckPartner = require('../Models/TrucPartner');

// Upload profile picture
router.post('/upload-profile/:id', upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;

    const updatedPartner = await TruckPartner.findByIdAndUpdate(
      id,
      { t_picture: filePath },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ error: 'Truck Partner not found' });
    }

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture: filePath,
      data: updatedPartner
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while uploading picture' });
  }
});

module.exports = router;
