const express = require("express");
const router = express.Router();
const ccontroller = controller("Api/CourseController");
const loginAuth = middleware("loginAuth");



// CREATE COURSE //

router.post('/course/create', loginAuth, (req, res) => {
    return ccontroller.createCourse(req, res);
});




// UPDATE COURSE //

router.patch('/course/update', loginAuth, (req, res) => {
    return ccontroller.updateCourse(req, res);
});




// DELETE COURSE //

router.delete('/course/delete', loginAuth, (req, res) => {
    return ccontroller.deleteCourse(req, res);
});




// TEACHER COURSES //

router.get('/course/teachercourses', loginAuth, (req, res) => {
    return ccontroller.teacherCourse(req, res);
});




// ALL COURSES //

router.get('/course/all', loginAuth, (req, res) => {
    return ccontroller.allCourse(req, res);
});



// COURSE ENROLL BY STUDENTS //

router.get('/enroll-course-students', loginAuth, (req, res) => {
    return ccontroller.enrollCourseByStudents(req, res);
});




module.exports = router;
