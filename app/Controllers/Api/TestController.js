const { Tests } = model("");
const { Lessons } = model("");
const { testSchema } = validate("TestValidator");
const { checkCourse } = helper("CourseHelpers");
const { Op } = require('sequelize');



module.exports = class TestController {




    // CREATE TEST //

    async createTest(req, res) {

        try {
            if (req.query.course_id && req.query.lesson_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    const { error, value } = testSchema.validate(req.body);

                    if (error) {
                        return res.status(400).json({ 'status': 'failed', 'message': error.message })
                    } else {
                        const test = {
                            lesson_id: lesson.id,
                            title: value.title
                        }
                        await Tests.create(test);
                        return res.status(200).json({ 'status': 'success', 'message': 'test creted successfully' });
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




    // DELETE TEST //

    async deleteTest(req, res) {

        try {
            if (req.query.course_id && req.query.lesson_id && req.query.test_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    const test = await Tests.findOne({ where: { [Op.and]: { lesson_id: lesson.id, id: req.query.test_id } } });
                    if (test) {
                        await test.destroy();
                        return res.status(200).json({ 'status': 'success', 'message': 'test deleted successfully' });
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





    // COURSES TEST //

    async courseTest(req, res) {

        try {
            if (req.query.course_id && req.query.lesson_id) {
                const course = await checkCourse(req.query.course_id, req, res);
                const lesson = await Lessons.findOne({ where: { [Op.and]: { course_id: course.id, id: req.query.lesson_id } } });
                if (lesson) {
                    const allTest = await Tests.findAll({ where: { lesson_id: lesson.id } });
                    return res.status(200).json({ 'status': 'success', 'data': allTest });
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







};