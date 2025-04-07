const Joi = require('joi');

// TruckPartner Validation
const validateTruckPartner = (data) => {
    const schema = Joi.object({
        t_name: Joi.string().required(),
        t_email: Joi.string().email().required(),
        t_password: Joi.string().min(6).required(),
        t_contact: Joi.string().required(),
        t_rc_number: Joi.string().required(),
        t_id_card_details: Joi.string().required(),
        t_pancard_details: Joi.string().required(),
        t_drivinglicence_details: Joi.string().required(),
        t_picture: Joi.string().required(),
        status: Joi.boolean(),
        on_work: Joi.boolean(),
        package_type: Joi.string().allow(null),
        price: Joi.number().allow(null),
        start_date: Joi.date(),
        end_date: Joi.date().allow(null),
        truck_type: Joi.string().max(20).allow(null)
    });
    return schema.validate(data);
};


// Transactions Validation
const validateTransactions = (data) => {
    const schema = Joi.object({
        truckpartner: Joi.string().required(),
        rides: Joi.string().required(),
        account_holder_name: Joi.string().max(20).required(),
        account_number: Joi.number().required(),
        ifsc_code: Joi.string().max(20).required(),
        date: Joi.date(),
        amount: Joi.number().min(0).required()
    });
    return schema.validate(data);
};

module.exports = {
    validateTruckPartner,
    validateRides,
    validateTransactions
};
