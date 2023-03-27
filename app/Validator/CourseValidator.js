const joi = require('joi');

const courseSchema = joi.object({
    course_name: joi.string().required(),
    description: joi.string().min(10).max(500).required(),
    course_price: joi.number().min(200).max(2000).required()
});



const courseUpdateSchema = joi.object({
    course_name: joi.string(),
    description: joi.string().min(10).max(500),
    course_price: joi.number().min(200).max(2000)
}).or('course_name', 'description', 'course_price').required();



module.exports = {
    courseSchema,
    courseUpdateSchema
};