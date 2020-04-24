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

module.exports = doctorRouter;