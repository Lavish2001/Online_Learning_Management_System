const { Courses, Enrollments } = model("");
const { Op } = require('sequelize');


// CHECK USER IS TEACHER OR NOT //

const checkTeacher = async (user, req, res) => {
    if (user.role === 'Teacher') {
        return;
        // code return to mainFunction
    } else {
        throw new Error('unauthorized user');
    };
};



// CHECK USER IS STUDENT OR NOT //

const checkStudent = async (user, req, res) => {
    if (user.role === 'Student') {
        return;
        // code return to mainFunction
    } else {
        throw new Error('unauthorized user');
    };
};



// CHECK USER ENROLL FOR COURSE //

const checkEnrollment = async (user, id, req, res) => {
    const enroll = await Enrollments.findOne({ where: { [Op.and]: { student_id: user.id, course_id: id } } })
    if (enroll) {
        return enroll;
        // code return to mainFunction
    } else {
        throw new Error('No Enrollment Found');
    };
};





// CHECK COURSE CREATED BY USER OR NOT //

const checkCourse = async (courseId, req, res) => {
    const find = await Courses.findOne({ where: { id: courseId } });
    if (find && find.teacher_id === req.user.id) {
        return find;
        // code return to mainFunction
    } else {
        throw new Error('user not authorized');
    }
}


module.exports = {
    checkTeacher,
    checkCourse,
    checkStudent,
    checkEnrollment
};

