const express = require("express");
const router = express.Router();
const gcontroller = controller("Api/GradeController");
const loginAuth = middleware("loginAuth");


// GET STUDENT GRADE //

router.get('/student-grade', loginAuth, (req, res) => {
    return gcontroller.studentGrade(req, res);
});



// GET ALL STUDENTS GRADE //

router.get('/all-students-grade', loginAuth, (req, res) => {
    return gcontroller.allStudentsGrade(req, res);
});



module.exports = router;
