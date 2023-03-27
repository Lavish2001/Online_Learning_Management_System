const express = require("express");
const router = express.Router();
const tcontroller = controller("Api/TestController");
const loginAuth = middleware("loginAuth");


// CREATE TEST //

router.post('/create-test', loginAuth, (req, res) => {
    return tcontroller.createTest(req, res);
});



// DELETE TEST //

router.delete('/delete-test', loginAuth, (req, res) => {
    return tcontroller.deleteTest(req, res);
});



// COURSE TEST //

router.get('/course-test', loginAuth, (req, res) => {
    return tcontroller.courseTest(req, res);
});



module.exports = router;
