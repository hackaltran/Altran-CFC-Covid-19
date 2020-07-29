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

router.post('/updatesymptom', function (req, res, next) {
    PatientController.updatesymptom(req, res, next);
});

router.get('/sosStatus/:patientid', PatientController.sosStatus);            //API TO GET THE STATUS OF SOS

router.post('/raiseSOS', function (req, res, next) {
    PatientController.raiseSOS(req, res, next);
});                                                                          //API TO RAISE/CANCEL SOS





// router.post('/add', function(req, res, next) {
//    PatientController.add(req, res, next);
// });

//router.get('/:patientid', PatientController.readPatient);
// router.get('/getquerydata', function (req, res,next) {
//     console.log("method calling");
//     PatientController.executeQuery();
// });

module.exports = router;