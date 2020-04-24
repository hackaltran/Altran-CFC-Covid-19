const express = require("express");

var router = express.Router();

const userController = require('./user.controller');

router.post('/signup', function(req, res, next) {
    userController.addUser(req, res, next);
});
router.post('/signin', function(req, res, next) {
    userController.signin(req, res, next);
});
router.post('/username', function(req, res, next) {
    userController.getUserName(req, res, next);
});
router.get('/:userid', userController.getUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;