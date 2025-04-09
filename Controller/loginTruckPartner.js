const TruckPartner = require("../Models/TrucPartner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const loginTruckPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = validateLogin({ email, password });
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const partner = await TruckPartner.findOne({ t_email: email });
    if (!partner) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, partner.t_password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });
    console.log(partner)
    const token = jwt.sign(
      { id: partner.truck_partner_uuid, role: "truck_partner" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      partner,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = loginTruckPartner;
