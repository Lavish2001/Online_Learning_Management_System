const { Options, Questions, Tests, Lessons } = model("");
const { questionSchema } = validate("QuestionValidator");
const { checkCourse } = helper("CourseHelpers");
const { Op } = require('sequelize');



module.exports = class QuestionController {




    // CREATE QUESTION //

    async createQuestion(req, res) {

        try {
            const { course_id, lesson_id, test_id } = req.query;
            if (course_id && lesson_id && test_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    const test = await Tests.findOne({ where: { [Op.and]: { lesson_id: lesson.id, id: test_id } } });
                    if (test) {
                        const { error, value } = questionSchema.validate(req.body);

                        if (error) {
                            return res.status(400).json({ 'status': 'failed', 'message': error.message })
                        } else {
                            const question = {
                                test_id: test.id,
                                question: value.question,
                                correct_answer: value.correct_answer
                            }
                            await Questions.create(question);
                            return res.status(200).json({ 'status': 'success', 'message': 'question creted successfully' });
                        }
                    } else {
                        return res.status(400).json({ 'status': 'failed', 'message': 'invalid test id' });
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid lesson id' });
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'error' });
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




    //  DELETE QUESTION //

    async deleteQuestion(req, res, next) {

        try {
            const { course_id, lesson_id, test_id, question_id } = req.query;
            if (course_id && lesson_id && test_id && question_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    const test = await Tests.findOne({ where: { [Op.and]: { lesson_id: lesson.id, id: test_id } } });
                    if (test) {
                        const question = await Questions.findOne({ where: { [Op.and]: { id: question_id, test_id: test.id } } });
                        if (question) {
                            await question.destroy();
                            return res.status(200).json({ 'status': 'success', 'message': 'question deleted successfully' });
                        } else {
                            return res.status(400).json({ 'status': 'failed', 'message': 'invalid question id' });
                        }
                    } else {
                        return res.status(400).json({ 'status': 'failed', 'message': 'invalid test id' });
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid lesson id' });
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'error' });
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message });
        };
    };




    // TEST QUESTION //

    async testQuestion(req, res, next) {

        try {
            const { course_id, lesson_id, test_id, question_id } = req.query;
            if (course_id && lesson_id && test_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    const test = await Tests.findOne({ where: { [Op.and]: { lesson_id: lesson.id, id: test_id } } });
                    if (test) {
                        const allQuestion = await Questions.findAll({
                            include: [
                                {
                                    model: Options, as: 'Options', attributes: { exclude: ['updatedAt', 'createdAt'] }
                                }
                            ], where: { test_id: test.id }, attributes: { exclude: ['createdAt', 'updatedAt', 'correct_answer'] }
                        });
                        return res.status(200).json({ 'status': 'success', 'data': allQuestion });
                    } else {
                        return res.status(400).json({ 'status': 'failed', 'message': 'invalid test id' });
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid lesson id' });
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'error' });
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message });
        };
    };




};





