const express = require('express');
const bodyParser = require('body-parser');
let service = require('./service');
const patientRouter = express.Router();

patientRouter.use(bodyParser.json());

//API for particular patient details
patientRouter.route('/:patientId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.get((req,res,next) => {
    service.getPatient(req.params.patientId, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.end("Error : Patient not found");
        }
    });
});

//API for particular patients according to health status
patientRouter.route('/status/:statusId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.get((req,res,next) => {
    console.log("Status Id received : " + req.params.statusId);
    if(req.params.statusId == 101 || req.params.statusId == 102 || req.params.statusId == 103) {
        service.getPatientByStatus(req.params.statusId, function (err, data) {
            if(data) {
                res.json(data);
                res.end(); 
            } else {
                res.statusCode = 400;
                res.end("Error : Patients not found");
            }
        });
    } else {
        res.statusCode = 400;
        res.end('Patients not found, invalid status Id : ' + req.params.statusId);
    }
});

//API to assign doctor by operator
patientRouter.route('/assign-doctor/:patientId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.put((req, res, next) => {
    console.log('Updating the patient: ' + req.params.patientId + '\n');
    service.assignDoctor(req.params.patientId, req, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.end("Error : Patient not found");
        }
    });
});

//API to assign risk by doctor
patientRouter.route('/assign-risk/:patientId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.put((req, res, next) => {
    console.log('Updating the risk for patient: ' + req.params.patientId + '\n');
    service.assignRisk(req.params.patientId, req, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.end("Error : Patient not found");
        }
    });
});

//API to assign risk by doctor
patientRouter.route('/assign-quarantine/:patientId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.put((req, res, next) => {
    console.log('Updating the qurantine for patient: ' + req.params.patientId + '\n');
    service.assignQuarantine(req.params.patientId, req, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.end("Error : Patient not found");
        }
    });
});

//API to update comment by doctor
patientRouter.route('/comment/:patientId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.get((req,res,next) => {
    service.getPatientComments(req.params.patientId, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.end("Error : Patient not found");
        }
    });
})
.post((req, res, next) => {
    console.log('Updating comments for patient: ' + req.params.patientId + '\n');
    service.updateComment(req.params.patientId, req, function (err, data) {
        if(data) {
            res.json(data);
            res.end();  
        } else {
            res.statusCode = 400;
            res.end("Error : Patient not found");
        }
    });
});

module.exports = patientRouter;

