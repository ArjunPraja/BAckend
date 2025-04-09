const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TruckPartnerSchema = new mongoose.Schema({
    truck_partner_uuid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
    },
    t_name: {
        type: String,
        required: true,
        trim: true
    },
    t_email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    t_password: {
        type: String,
        required: true,
        trim: true
    },
    t_contact: {
        type: String,
        required: true,
        trim: true
    },
    t_rc_number: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    t_id_card_details: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    t_pancard_details: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    t_drivinglicence_details: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    t_picture: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: false
    },
    on_work: {
        type: Boolean,
        default: false
    },
    package_type: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    start_date: {
        type: Date, default: Date.now
    },
    end_date: {
        type: Date, default: null
    },
    truck_type: {
        type: String, maxlength: 20, default: null
    }
});

module.exports = mongoose.model('TruckPartner', TruckPartnerSchema);
