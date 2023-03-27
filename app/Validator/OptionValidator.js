const joi = require('joi');

const optionSchema = joi.object({
    option: joi.string().required()
});



module.exports = {
    optionSchema
};