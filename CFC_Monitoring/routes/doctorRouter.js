const express = require('express');
const bodyParser = require('body-parser');
let service = require('./service');
const doctorRouter = express.Router();

doctorRouter.use(bodyParser.json());

//API for all doctor details
doctorRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.get((req,res,next) => {
    service.getAllDoctors(function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 500;
            res.end("Error : No patients found / Server error");
        }
    });
});

//API for all doctor details
doctorRouter.route('/:statusId/:doctorId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.get((req,res,next) => {
    service.getPatientsForDoctor(req.params.statusId, req.params.doctorId,function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 500;
            res.end("Error : No patients found / Server error");
        }
    });
});

//API to reset passowrd for operator/doctor
doctorRouter.route('/resetPassword')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.put((req, res, next) => {
    service.resetPassword(req.body.id, req, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.responseCode = 'ERROR';
            error = {
                "error" : "email not eist",
                "responseCode":"ERROR",
                "statusCode" : 400
            }
            res.end(JSON.stringify(error));
        }
    });
});


//API to verify email for operator/doctor
doctorRouter.route('/verifyEmail')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.put((req, res, next) => {
    service.verifyEmail(req.body.email, req, function (err, data) {

        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.responseCode = 'ERROR';
            error = {
                "error" : "email not eist",
                "responseCode":"ERROR",
                "statusCode" : 400
            }
            res.end(JSON.stringify(error));
        }
    });
});

//API to sign up for operator/doctor
doctorRouter.route('/allUser')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.get((req, res, next) => {
    service.getAllUsers(req, function (err, data) {

        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.responseCode = 'ERROR';
            error = {
                "error" : "Failed",
                "responseCode":"ERROR",
                "statusCode" : 400
            }
            res.end(JSON.stringify(error));
        }
    });
});

//API to sign up for operator/doctor
doctorRouter.route('/signup')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.post((req, res, next) => {
    service.signup(req, function (err, data) {

        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.responseCode = 'ERROR';
            error = {
                "error" : "Failed",
                "responseCode":"ERROR",
                "statusCode" : 400
            }
            res.end(JSON.stringify(error));
        }
    });
});

module.exports = doctorRouter;