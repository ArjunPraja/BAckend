// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { Contact, ContactValidator } = require('../Models/Contact'); // Adjust path as needed
const { v4: uuidv4 } = require('uuid');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const contactData = {
      contact_uuid: uuidv4(),
      ...req.body
    };

    const { error } = ContactValidator(contactData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newContact = new Contact(contactData);
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
