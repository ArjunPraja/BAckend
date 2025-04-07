const TruckPartner = require('../Models/TrucPartner');
const bcrypt = require('bcryptjs');

const RegisterTruckPartner = async (req, res) => {
  try {
    const {
      t_name,
      t_email,
      t_password,
      t_contact,
      t_rc_number,
      t_id_card_details,
      t_pancard_details,
      t_drivinglicence_details,
      t_picture,
      truck_type,
    } = req.body;

    if (
      !t_name || !t_email || !t_password || !t_contact ||
      !t_rc_number || !t_id_card_details || !t_pancard_details ||
      !t_drivinglicence_details || !t_picture || !truck_type
    ) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const existingPartner = await TruckPartner.findOne({ t_email });
    if (existingPartner) {
      return res.status(400).json({ msg: 'Email already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(t_password, salt);

    const newPartner = new TruckPartner({
      t_name,
      t_email,
      t_password: hashedPassword,
      t_contact,
      t_rc_number,
      t_id_card_details,
      t_pancard_details,
      t_drivinglicence_details,
      t_picture,
      truck_type,
    });

    await newPartner.save();

    return res.status(201).json({
      msg: 'Truck partner registered successfully',
      partner: {
        uuid: newPartner.truck_partner_uuid,
        name: newPartner.t_name,
        email: newPartner.t_email,
      },
    });
  } catch (error) {
    // Handle MongoDB Duplicate Key Error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];

      return res.status(400).json({
        msg: `Duplicate value found: "${duplicateValue}" already exists for field "${duplicateField}". Please use a different value.`,
        field: duplicateField,
        value: duplicateValue
      });
    }

    console.error('❌ Error registering truck partner:', error);
    return res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
};

module.exports = RegisterTruckPartner;
