const joi = require('joi');

const testSchema = joi.object({
    title: joi.string().max(500).required(),
});


module.exports = {
    testSchema
};