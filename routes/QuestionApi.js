const express = require("express");
const router = express.Router();
const qcontroller = controller("Api/QuestionController");
const loginAuth = middleware("loginAuth");


// CREATE QUESTION //

router.post('/create-question', loginAuth, (req, res) => {
    return qcontroller.createQuestion(req, res);
});



// DELETE QUESTION //

router.delete('/delete-question', loginAuth, (req, res) => {
    return qcontroller.deleteQuestion(req, res);
});



// TEST QUESTION //

router.get('/test-question', loginAuth, (req, res) => {
    return qcontroller.testQuestion(req, res);
});





module.exports = router;
