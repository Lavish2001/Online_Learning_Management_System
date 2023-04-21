const { Enrollments, Lessons, Options, Grades, Marks, Tests, Courses, Questions, Userss } = model("");
const { checkStudent, checkTeacher } = helper("CourseHelpers");
const { Op } = require('sequelize');




module.exports = class MarksController {




    // ALL STUDENTS TEST MARKS //

    async studentsMarks(req, res) {
        try {
            const { test_id } = req.query;
            await checkTeacher(req.user);
            const tests = await Tests.findAll({
                include: [
                    {
                        model: Users, as: 'Students', attributes: { exclude: ['password', 'role', 'updatedAt', 'createdAt'] },
                        through: {
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        },
                    },
                ], where: { id: test_id }, attributes: { exclude: ['updatedAt', 'createdAt'] }
            });
            return res.status(200).json({ 'status': 'success', 'data': tests })
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // SINGLE STUDENT TEST MARKS //

    async singleStudentMarks(req, res) {
        try {
            const { test_id } = req.query;
            await checkStudent(req.user);
            const marks = await Marks.findOne({ where: { [Op.and]: { test_id: test_id, student_id: req.user.id } }, attributes: { exclude: ['updatedAt', 'createdAt'] } });
            return res.status(200).json({ 'status': 'success', 'data': marks })
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        }
    };




    // STUDENT MARKS WHEN TEST IS COMEPLTED //

    async giveMarks(req, res, next) {

        try {
            const { test_id } = req.query;
            await checkStudent(req.user);
            const test = await Tests.findOne({ where: { id: test_id } });
            const lesson = await Lessons.findOne({ where: { id: test.lesson_id } })
            const course = await Courses.findOne({ where: { id: lesson.course_id } });
            const enroll = await Enrollments.findOne({ where: { [Op.and]: { student_id: req.user.id, course_id: course.id } } });
            if (test, lesson, course, enroll) {
                const questions = await Questions.findAll({ where: { [Op.and]: { test_id: test.id, id: { [Op.in]: Object.keys(req.body) } } } });
                const options = await Options.findAll({ where: { [Op.and]: { id: { [Op.in]: Object.values(req.body) }, question_id: { [Op.in]: Object.keys(req.body) } } } });
                if (Object.keys(req.body).length === questions.length) {
                    const allTestQuestions = await Questions.findAll({
                        where: { test_id: test.id }
                    });
                    if (allTestQuestions.length === Object.keys(req.body).length) {
                        if (options.length === Object.values(req.body).length) {

                            let correct_questions = 0;
                            for (let x in questions) {
                                if (questions[x].correct_answer === options[x].option) {
                                    correct_questions++;
                                }
                            };

                            const marks = {
                                test_id: test_id,
                                student_id: req.user.id,
                                student_marks: correct_questions,
                                total_marks: allTestQuestions.length
                            }

                            const student_marks = await Marks.create(marks);
                            const allLessons = await Lessons.findAll({ where: { course_id: course.id }, attributes: ['id'] });
                            const lessonId = allLessons.map((id) => { return id.id });
                            const allTest = await Tests.findAll({ where: { lesson_id: { [Op.in]: lessonId } } });
                            const testId = allTest.map((id) => { return id.id });
                            const check = await Marks.findAll({ where: { [Op.and]: { test_id: { [Op.in]: testId }, student_id: req.user.id } } });
                            if (check.length == allLessons.length) {
                                enroll.update({
                                    completed_at: Date.now()
                                });
                                let totalMarks = 0;
                                let totalStudentMarks = 0;
                                for (let i = 0; i < check.length; i++) {
                                    totalMarks += Number(check[i].total_marks);
                                    totalStudentMarks += Number(check[i].student_marks);
                                };
                                let percentage = (totalStudentMarks / totalMarks) * 100;
                                const grades = {
                                    course_id: enroll.course_id,
                                    student_id: enroll.student_id,
                                    grade: (percentage >= 80 && percentage <= 100) ? 'A' : (percentage >= 60 && percentage < 80) ? 'B' :
                                        (percentage >= 40 && percentage < 60) ? 'C' : 'D'
                                }
                                const studentGrade = await Grades.create(grades);
                                return res.status(200).json({ 'status': 'success', 'course_completed': enroll.completed_at, "grade": studentGrade.grade })
                            } else {
                                return res.status(200).json({ 'status': 'success', 'course_completed': enroll.completed_at, 'test result': student_marks })
                            }


                        } else {
                            return res.status(400).json({ 'status': 'failed', 'message': 'select valid option id' })
                        }
                    } else {
                        return res.status(400).json({ 'status': 'failed', 'message': 'attempt all questions' })
                    }
                } else {
                    return res.status(400).json({ 'status': 'failed', 'message': 'select valid question id' })
                }
            } else {
                return res.status(400).json({ 'status': 'failed', 'message': 'ERROR' })
            }
        } catch (err) {
            return res.status(500).json({ 'status': 'failed', 'message': err.message })
        };
    };




};