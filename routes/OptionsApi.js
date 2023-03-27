const express = require("express");
const router = express.Router();
const ocontroller = controller("Api/OptionController");
const loginAuth = middleware("loginAuth");


// INSERT OPTIONS FOR QUESTION //

router.post('/insert-options', loginAuth, (req, res) => {
    return ocontroller.insertOptions(req, res);
});



module.exports = router;
