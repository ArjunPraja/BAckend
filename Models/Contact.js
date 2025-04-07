const mongoose = require('mongoose');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const ContactSchema = new mongoose.Schema({
    contact_uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4 
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    number: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    }
});

const ContactValidator = (data) => {
    const schema = Joi.object({
        contact_uuid: Joi.string().guid({ version: 'uuidv4' }).required(),
        name: Joi.string().trim().required(),
        email: Joi.string().email().trim().lowercase().required(),
        number: Joi.string().max(15).required(),
        message: Joi.string().required()
    });

    return schema.validate(data);
};

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = { Contact, ContactValidator };
