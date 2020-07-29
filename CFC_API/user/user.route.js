const express = require("express");

var router = express.Router();

const userController = require('./user.controller');
const multer = require('multer');
const upload = multer({dest: __dirname + '/../images/'});

router.post('/signup', function(req, res, next) {
    userController.addUser(req, res, next);
});
router.post('/signin', function(req, res, next) {
    userController.signIn(req, res, next);
});
router.post('/username', function(req, res, next) {
    userController.getUserName(req, res, next);
});

//validate OTP for MobileNumber
router.post('/verifyOtp', function(req, res, next) {
    userController.otpValidation(req, res, next);
 });

//get user details Api
router.get('/:userId', userController.getUser);
router.get('/getdetails/:mobileNum', userController.getUserbyMobileNum);
router.delete('/:userId', userController.deleteUser);


//update user
router.post('/:userId', upload.single('profile'), function(req, res, next) {
    userController.updateUser(req, res, next);
});

//upload image
router.post('/', function(req, res, next) {

});

//generate Otp on MobileNumber
router.post('/generateOtp/:MobileNum', function(req, res, next){
    userController.generateOtpMobile(req, res, next);
});




module.exports = router; 


