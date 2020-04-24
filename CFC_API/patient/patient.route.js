const express = require("express");

var router = express.Router();

const PatientController = require('./patient.controller');
router.post('/covidpatient', function (req, res, next) {
    PatientController.covidpatient(req, res, next);
});

router.post('/addsymptom', function (req, res, next) {
    PatientController.addsymptom(req, res, next);
});
router.post('/findsymptom', function (req, res, next) {
    PatientController.findsymptom(req, res, next);
});

// router.post('/add', function(req, res, next) {
//    PatientController.add(req, res, next);
// });

//router.get('/:patientid', PatientController.readPatient);
// router.get('/getquerydata', function (req, res,next) {
//     console.log("method calling");
//     PatientController.executeQuery();
// });

module.exports = router;