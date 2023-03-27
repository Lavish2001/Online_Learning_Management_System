const express = require("express");
const router = express.Router();
const mcontroller = controller("Api/MarksController");
const loginAuth = middleware("loginAuth");


// STUDENTS MARKS WHEN TEST IS COMPLETED //

router.post('/check-marks', loginAuth, (req, res) => {
    return mcontroller.giveMarks(req, res);
});



// ALL STUDENTS TEST MARKS //

router.get('/students-marks', loginAuth, (req, res) => {
    return mcontroller.studentsMarks(req, res);
});



// SINGLE STUDENT TEST MARKS //

router.get('/single-student-marks', loginAuth, (req, res) => {
    return mcontroller.singleStudentMarks(req, res);
});




module.exports = router;
