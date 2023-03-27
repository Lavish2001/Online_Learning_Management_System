const { Courses } = model("");
const { Grades } = model("");
const { Users } = model("");
const { checkStudent, checkTeacher } = helper("CourseHelpers");
const remove = ['updatedAt', 'createdAt'];
const { Op } = require('sequelize');





module.exports = class GradeController {




    // STUDENT GRADE //

    async studentGrade(req, res) {

        try {
            await checkStudent(req.user)
            const { course_id } = req.query;
            const course = await Courses.findOne({ where: { id: course_id } });
            if (course) {
                const grade = await Grades.findOne({ where: { [Op.and]: { student_id: req.user.id, course_id: course_id } }, attributes: { exclude: remove } });
                return res.status(200).json({ 'status': 'success', 'data': grade })
            }
            return res.status(400).json({ 'status': 'failed', 'messages': 'ERROR' })
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




    // ALL STUDENTS GRADE //

    async allStudentsGrade(req, res) {

        try {
            await checkTeacher(req.user);
            const allCoursesGrades = await Courses.findAll({
                include: [
                    {
                        model: Users, as: 'Students', attributes: { exclude: ['password', 'role', 'updatedAt', 'createdAt'] },
                        through: {
                            attributes: { exclude: ['updatedAt', 'createdAt', 'id'] }
                        }
                    }
                ],
                where: { teacher_id: req.user.id }, as: 'Courses', order: [['createdAt']], attributes: { exclude: ['course_id', 'createdAt', 'updatedAt'] }
            });
            return res.status(200).json({ 'status': 'success', 'data': allCoursesGrades })
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




};
























