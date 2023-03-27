const express = require("express");
const router = express.Router();
const lcontroller = controller("Api/LessonController");
const loginAuth = middleware("loginAuth");


// CREATE LESSONS //

router.post('/create-lesson', loginAuth, (req, res) => {
    return lcontroller.createLesson(req, res);
});



// DELETE LESSONS //

router.delete('/delete-lesson', loginAuth, (req, res) => {
    return lcontroller.deleteLesson(req, res);
});




// UPDATE LESSONS //

router.patch('/updatelesson', loginAuth, (req, res) => {
    return lcontroller.updateLesson(req, res);
});



// COURSE LESSONS //

router.get('/course-lesson', loginAuth, (req, res) => {
    return lcontroller.courseLesson(req, res);
});



// COMPLETE LESSON //

router.get('/complete-lesson', loginAuth, (req, res) => {
    return lcontroller.completeLesson(req, res);
});



module.exports = router;
