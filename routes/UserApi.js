const express = require("express");
const router = express.Router();
const ucontroller = controller("Api/UserController");
const loginAuth = middleware("loginAuth");


// USER SIGNUP //

router.post('/signup', (req, res) => {
  return ucontroller.signup(req, res);
});



// USER LOGIN //

router.post('/login', (req, res) => {
  return ucontroller.login(req, res);
});



// USER LOGOUT //

router.delete('/logout', loginAuth, (req, res) => {
  return ucontroller.logout(req, res);
});



// TOTAL LOGIN COUNT //

router.get('/getlogincount', loginAuth, (req, res) => {
  return ucontroller.loginCount(req, res);
});



// LOGOUT FROM ANOTHER DEVICES //

router.delete('/logout-other-devices', loginAuth, (req, res) => {
  return ucontroller.logoutOtherDevices(req, res);
});



// UPDATE USER DETAILS //

router.patch('/changepassword', loginAuth, (req, res) => {
  return ucontroller.changePassword(req, res);
});



// DEACTIVATE ACCOUNT //

router.delete('/deactivate', loginAuth, (req, res) => {
  return ucontroller.deactivate(req, res);
});



module.exports = router;
