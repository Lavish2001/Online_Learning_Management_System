const { Enrollments, Courses, Users, Lessons } = model("");
const { checkStudent, checkTeacher } = helper("CourseHelpers");
const { Op } = require('sequelize');




module.exports = class EnrollmentController {




    // CREATE ENROLLMENT //

    async createEnrollment(req, res) {

        try {
            if (req.query.course_id) {
                await checkStudent(req.user);
                const course = await Courses.findOne({ where: { id: req.query.course_id } });
                if (course) {
                    let enroll = {
                        student_id: req.user.id,
                        course_id: req.query.course_id
                    };
                    await Enrollments.create(enroll);
                    return res.status(200).json({ 'status': 'success', 'message': 'enrollment successful' })
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid course id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select a course for enrollment' })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




    // AFTER ENROLLMENT STUDENT GET COURSES WITH LESSONS //

    async studentEnrollCourses(req, res) {
        try {
            await checkStudent(req.user);
            const allCourses = await Enrollments.findAll({
                include: [
                    {
                        model: Courses, as: 'Course', attributes: { exclude: ['teacher_id', 'updatedAt', 'createdAt'] }, include: [
                            { model: Users, as: 'Created_By', attributes: { exclude: ['role', 'password', 'updatedAt', 'createdAt'] } },
                            { model: Lessons, as: 'Lessons', attributes: { exclude: ['course_id', 'updatedAt', 'createdAt'] } }
                        ]
                    }
                ],
                where: { student_id: req.user.id }, attributes: { exclude: ['course_id', 'student_id', 'updatedAt', 'createdAt'] }
            });
            if (allCourses.length) {
                return res.status(200).json({ 'status': 'success', 'data': allCourses })
            } else {
                return res.status(400).json({ 'status': 'success', 'message': 'no enrollments found' })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




    // CANCEL STUDENT ENROLLMENT //

    async cancelEnrollment(req, res) {

        try {
            if (req.query.course_id) {
                const course = await Courses.findOne({ where: { id: req.query.course_id } });
                if (course) {
                    const enroll = await Enrollments.findOne({ where: { [Op.and]: { course_id: req.query.course_id, student_id: req.user.id } } });
                    if (enroll) {
                        await Enrollments.destroy({ where: { [Op.and]: { course_id: enroll.course_id, student_id: enroll.student_id } } });
                        return res.status(200).json({ 'status': 'success', 'message': 'student enrollment cancelled successfully' });
                    } else {
                        return res.status(400).json({ 'status': 'failed', 'message': 'please enroll this course first' })
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'invalid course id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'please select a course' })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // STUDENT ENROLLMENT COURSE LIST //

    async studentEnrollList(req, res) {
        try {
            await checkTeacher(req.user);
            const { course_id } = req.query;
            const allStudentsList = await Courses.findOne({
                where: { [Op.and]: { teacher_id: req.user.id, id: course_id } }, attributes: { exclude: ['updatedAt', 'createdAt'] }, through: {
                    attributes: []
                },
                include: {
                    model: Users, as: 'EnrolledStudents', attributes: { exclude: ['role', 'password', 'updatedAt', 'createdAt'] },
                    through: {
                        attributes: []
                    }
                }
            });
            return res.status(200).json({ 'status': 'success', 'data': allStudentsList })
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




};