const Joi = require('joi')

module.exports.registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email()
})

