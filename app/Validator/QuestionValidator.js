const joi = require('joi');

const questionSchema = joi.object({
    question: joi.string().max(1000).required(),
    correct_answer: joi.string().required()
});



module.exports = {
    questionSchema
};