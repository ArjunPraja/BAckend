const mongoose = require("mongoose");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    contact: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true, // Fixed typo (true instead of True)
        default: "User",
    },
});

const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).trim().required(),
        email: Joi.string().email().lowercase().required(),
        contact: Joi.string().pattern(/^\d{10,15}$/).required().messages({
            "string.pattern.base": "Contact number must be between 10-15 digits.",
        }),
        password: Joi.string().min(6).max(100).required(),
    });

    return schema.validate(data);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User, validateUser };
