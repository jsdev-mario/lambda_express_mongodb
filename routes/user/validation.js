var Joi = require('joi');

exports.signup = {
    body: {
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        gender: Joi.number(),
        phoneNumber: Joi.string().allow(''),
    }
}

exports.get_user = {
    query: {
        _id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),
    }
}