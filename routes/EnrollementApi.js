const express = require("express");
const router = express.Router();
const econtroller = controller("Api/EnrollmentController");
const loginAuth = middleware("loginAuth");


// CREATE ENROLLMENT //

router.post('/create-enrollment', loginAuth, (req, res) => {
    return econtroller.createEnrollment(req, res);
});




// AFTER ENROLLMENT STUDENT GET COURSES WITH LESSONS //

router.get('/student-enroll-courses', loginAuth, (req, res) => {
    return econtroller.studentEnrollCourses(req, res);
});



// CANCEL STUDENT ENROLLMENT //

router.delete('/cancel-enrollment', loginAuth, (req, res) => {
    return econtroller.cancelEnrollment(req, res);
});



// STUDENT COURSE ENROLLMENT LIST //

router.get('/student-list', loginAuth, (req, res) => {
    return econtroller.studentEnrollList(req, res);
});



module.exports = router;
