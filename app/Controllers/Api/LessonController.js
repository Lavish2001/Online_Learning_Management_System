const { Enrollments } = model("");
const { Lessons } = model("");
const { Questions } = model("");
const { Courses } = model("");
const { Tests } = model("");
const { Options } = model("");
const { checkCourse, checkEnrollment } = helper("CourseHelpers");
const { upload } = helper("LessonHelpers");
const { Op } = require('sequelize');


// DEFINE SCOPES FOR MODELS //

Questions.addScope('removeAttributes', {
    include: { model: Options, as: 'Options', attributes: { exclude: ['createdAt', 'updatedAt', 'id'] } },
    attributes: { exclude: ['createdAt', 'updatedAt', 'correct_answer'] }
});

Tests.addScope('removeAttributes', {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
});

Options.addScope('removeAttributes', {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
});




module.exports = class LessonController {




    // CREATE LESSONS FOR COURSE //

    async createLesson(req, res) {

        try {
            if (req.query.course_id) {

                await upload(req, res, async (err) => {

                    if (err) {
                        return res.status(400).json({ 'status': 'failed', 'message': err.message });

                    } else {
                        if ((req.files['lesson-video'] && req.files['lesson-video'][0]) || (req.files['lesson-document'] && req.files['lesson-document'][0]) && req.body.description && req.body.order) {
                            try {
                                const course = await checkCourse(req.query.course_id, req, res);
                                const lessonData = {
                                    video: req.files['lesson-video'] ? req.files['lesson-video'][0].filename : '',
                                    description: req.body.description,
                                    order: req.body.order,
                                    course_id: course.id,
                                    documentation: req.files['lesson-document'] ? req.files['lesson-document'][0].filename : ''
                                };
                                await Lessons.create(lessonData);
                                return res.status(200).json({ 'status': 'success', 'message': 'course lesson created successfully' })
                            } catch (err) {
                                return res.status(500).json({ 'status': 'failed', 'message': err.message })
                            }

                        } else {
                            return res.status(400).json({ 'status': 'failed', 'message': 'all fields required' })
                        };
                    };
                });

            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select course id' })
            };

        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }

    };




    // COURSE LESSONS //

    async courseLesson(req, res) {
        try {
            if (req.query.course_id) {
                const course = await Courses.findOne({ where: { id: req.query.course_id } });
                if (course) {
                    const enrollOrNot = await Enrollments.findOne({ where: { [Op.and]: { course_id: req.query.course_id, student_id: req.user.id } } });
                    if (req.user.role === 'Teacher' || enrollOrNot) {
                        const courseLesson = await Lessons.findAll({ where: { course_id: req.query.course_id }, order: ['order'], attributes: { exclude: ['updatedAt', 'createdAt'] } });
                        return res.status(200).json({ 'status': 'success', 'data': courseLesson });
                    } else {
                        return res.status(400).json({ 'status': 'failed', 'message': 'unauthorize user' })
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'please select valid course id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select course id' })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // UPDATE COURSE LESSONS //

    async updateLesson(req, res) {

        try {
            if (req.query.lesson_id && req.query.course_id) {

                await upload(req, res, async (err) => {

                    if (err) {
                        return res.status(400).json({ 'status': 'failed', 'message': err.message });

                    } else {
                        if ((req.files && req.files['lesson-video']) || (req.files && req.files['lesson-document']) || req.body.description || req.body.order) {
                            try {
                                await checkCourse(req.query.course_id, req, res);
                                const lesson = await Lessons.findOne({ where: { id: req.query.lesson_id } });
                                if (lesson) {
                                    const updateLesson = {
                                        video: req.files['lesson-video'] ? req.files['lesson-video'][0].filename : lesson.video,
                                        description: req.body.description || lesson.description,
                                        order: req.body.order || lesson.order,
                                        documentation: req.files['lesson-document'] ? req.files['lesson-document'][0].filename : lesson.documentation
                                    };
                                    await lesson.update(updateLesson);
                                    return res.status(200).json({ 'status': 'success', 'message': 'course lesson updated successfully' });
                                } else {
                                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid lesson id' })
                                }
                            } catch (err) {
                                return res.status(500).json({ 'status': 'failed', 'message': err.message })
                            }

                        } else {
                            return res.status(400).json({ 'status': 'failed', 'message': 'all fields required' })
                        };
                    };
                });

            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select course and lesson id' })
            };

        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }

    };




    // DELETE COURSE LESSONS //

    async deleteLesson(req, res) {

        try {
            if (req.query.lesson_id && req.query.course_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    await lesson.destroy();
                    return res.status(200).json({ 'status': 'success', 'message': 'course lesson deleted successfully' })
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'please select a valid lesson id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select course and lesson' })
            };

        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }

    };




    // COMPLETE COURSE LESSON //

    async completeLesson(req, res) {

        try {
            if (req.query.lesson_id && req.query.course_id) {
                const enroll = await checkEnrollment(req.user, req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: enroll.course_id, id: req.query.lesson_id } } });
                if (lesson) {
                    const test = await Tests.scope('removeAttributes').findOne({
                        include: { model: Questions.scope('removeAttributes'), as: 'Questions' },
                        where: { lesson_id: lesson.id }
                    })
                    return res.status(200).json({ 'status': 'success', 'data': test })
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'please select a valid lesson id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'error' })
            };

        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




};
