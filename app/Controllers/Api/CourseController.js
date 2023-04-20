const { Courses } = model("");
const express = require('express');
const app = express();
const { courseSchema, courseUpdateSchema } = validate("CourseValidator");
const { checkTeacher, checkCourse } = helper("CourseHelpers");
const { Op } = require('sequelize');
const { Questions } = model("");
const { Lessons } = model("");
const { Users } = model("");
const { Tests } = model("");
const { Options } = model("");
const { sequelize } = require('../../Models/index');


module.exports = class CourseController {




    // CREATE COURSE //

    async createCourse(req, res) {
        try {
            const { error, value } = courseSchema.validate(req.body);

            if (error) {
                return res.status(400).json(error.message)

            } else {
                await checkTeacher(req.user);
                await Courses.create({
                    teacher_id: req.user.id,
                    course_name: value.course_name,
                    description: value.description,
                    course_price: value.course_price
                });
                return res.status(200).json({ 'status': 'success', "message": "Course created successfully" })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // UPDATE COURSE //

    async updateCourse(req, res) {
        try {
            const { error, value } = courseUpdateSchema.validate(req.body);

            if (error) {
                return res.status(400).json(error.message)

            } else {
                const course = await checkCourse(req.query.id, req, res);

                await course.update({
                    course_name: value.course_name || course.course_name,
                    description: value.description || course.description,
                    course_price: value.course_price || course.course_price
                });
                return res.status(200).json({ 'status': 'success', 'message': 'course details updated successfully' });
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // DELETE COURSE //

    async deleteCourse(req, res) {

        try {

            if (req.query.id) {
                const course = await checkCourse(req.query.id, req, res);
                await course.destroy();
                return res.status(200).json({ 'status': 'failed', 'message': 'course deleted successfully' })

            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select a course' });
            };
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }

    };




    // TEACHER COURSES //

    async teacherCourse(req, res) {

        try {
            await checkTeacher(req.user);
            const all = await Courses.findAll({
                include: [
                    {
                        include: [
                            {
                                include: [
                                    {
                                        include: {
                                            model: Options, as: 'Options', attributes: { exclude: ['question_id', 'updatedAt', 'createdAt'] }
                                        }, model: Questions, as: 'Questions', attributes: { exclude: ['test_id', 'updatedAt', 'createdAt'] }
                                    }
                                ], model: Tests, as: 'Tests', attributes: { exclude: ['course_id', 'updatedAt', 'createdAt'] }
                            }
                        ], model: Lessons, as: 'Lessons', attributes: { exclude: ['course_id', 'updatedAt', 'createdAt'] }
                    },
                ],
                where: { teacher_id: req.user.id }, order: ['createdAt'], attributes: { exclude: ['updatedAt', 'createdAt'] }
            });
            return res.status(200).json({ 'status': 'success', 'data': all })
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }

    };




    // ALL COURSES //

    async allCourse(req, res) {
        try {
            const whereClause = {};
            if (req.query.name) {
                whereClause.course_name = { [Op.like]: `%${req.query.name}%` };
            }
            const all = await Courses.findAll({
                include: [
                    { model: Users, as: 'Created_By', attributes: { exclude: ['role', 'password', 'updatedAt', 'createdAt'] } }
                ], where: whereClause, order: ['createdAt'], attributes: { exclude: ['updatedAt', 'createdAt', 'Lessons', 'teacher_id'] }
            });
            return res.status(200).json({ 'status': 'success', 'data': all });
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // ENROLL COURSE BY STUDENTS //

    async enrollCourseByStudents(req, res) {
        try {
            if (req.query.course_id) {
                const find = await Courses.findOne({ where: { id: req.query.course_id } });
                if (find) {
                    const students = await Courses.findAll({
                        where: { id: req.query.course_id }, attributes: { exclude: ['updatedAt', 'createdAt', 'Lessons', 'teacher_id'] },
                        include: [
                            {
                                model: Users, as: 'EnrolledStudents', attributes: { exclude: ['password', 'role', 'updatedAt', 'createdAt'] },
                                through: {
                                    attributes: []
                                },
                            }
                        ]
                    });
                    return res.status(200).json({ 'status': 'success', 'data': students });
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid course id' });
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select course id' });
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };


};
