'use strict';

// External Imports
const { merge } = require('lodash');

// load the Cloudant library
var Cloudant = require('@cloudant/cloudant');
const query = require("../db_query/query");

const cloudant = new Cloudant({ url: 'https://633f24c3-b128-4545-845b-6a7171ec5174-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'Fnm4HIcpY38re_vih-x0Wc4QJilVDtJFyjftv4B0iavp' } } });
var patient_dbname = 'c4c_db';
var monitor_dbname = 'c4c_doctor';
var db = null;
var doc = null;

// create a database

module.exports = {

    // Authenticate a user
    verifyUser: function (request, callback) {
        console.log("Verifying user : ", request.body.username);
        db = cloudant.db.use(monitor_dbname);
        db.get(request.body.username, function (err, user) {
            if(user) {
                if(request.body.password == user.password) {
                    callback(null, user);
                } else {
                    callback("Invalid password", null);
                }
            } else {
                callback("Invalid username", null);
            }
        });
    },

    // Get patient details by Patient ID
    getPatient: function (patientId, callback) {
        console.log("Reading document for patient : " + patientId);
        db = cloudant.db.use(patient_dbname);
        let dbquery = query.findByPatientId(patientId);
        console.log("query to database : ", dbquery);
        db.find(dbquery, function  (err, data) {
            callback(err, data);
        });
    },

    getPatientComments: function (patientId, callback) {
        console.log("Reading comments for patient : " + patientId);
        db = cloudant.db.use(patient_dbname);
        let dbquery = query.findCommentsByPatientId(patientId);
        console.log("query to database : ", dbquery);
        db.find(dbquery, function  (err, data) {
            callback(err, data);
        });
    },

    // Get patient details for doctor
    getPatientsForDoctor: function (statusCode, doctorId, callback) {
        console.log("Getting patients for doctor : " + doctorId + "with status : ", statusCode);
        db = cloudant.db.use(patient_dbname);
        var dbquery = null;
        if(statusCode == 101) {
            dbquery = query.searchPositiveForDoctor(doctorId);
        } else if(statusCode == 102) {
            dbquery = query.searchPossibleForDoctor(doctorId);
        } else {
            dbquery = query.searchAllForDoctor(doctorId);
        }
        console.log("query to database : ", dbquery);
        db.find(dbquery, function  (err, data) {
            callback(err, data);
        });
    },

    // Get patient details by health status
    getPatientByStatus: function (statusCode, callback) {
        db = cloudant.db.use(patient_dbname);
        var dbquery = null;
        if(statusCode == 101) {
            dbquery = query.searchCovidPositive();
        } else if(statusCode == 102) {
            dbquery = query.searchCovidPossible();
        } else {
            dbquery = query.getAllPatients();
        }
        console.log("query to database : ", dbquery);
        db.find(dbquery, function  (err, data) {
            callback(err, data);
        });
    },

    // Get all patients details
    getAllPatients: function (callback) {
        console.log("Listing all documents");
        db = cloudant.db.use(patient_dbname);
        db.list({include_docs:true}, function (err, data) {
            callback(err, data);
        });
    },

    getAllDoctors: function (callback) {
        console.log("Listing all doctors");
        db = cloudant.db.use(monitor_dbname);
        let dbquery = query.getAllDoctors();
        db.find(dbquery, function  (err, data) {
            callback(err, data);
        });
    },

    // Assign doctor to a patient
    assignDoctor: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if(request.body.doctorId && request.body.operatorId 
                    && request.body.timestamp && request.body.operatorName) {
                    data.doctorId = request.body.doctorId;
                    data.assignedByOperator.id = request.body.operatorId;
                    data.assignedByOperator.timestamp = request.body.timestamp;
                    data.assignedByOperator.name = request.body.operatorName;
                    data.currentAssign = "doctor";
                } else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                   if(data) {
                        callback(null, data);
                   } else {
                        callback("Patient Update failed", null);
                   }
                });
            } else {
                callback("Patient not found in db", null);
            }
        });
    },

    assignRisk: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if (request.body.risk) {
                    if (request.body.risk == 101) {
                        data.healthstatus = "positive";
                    } else if (request.body.risk == 102) {
                        data.healthstatus = "possible";
                    } else {
                        data.healthstatus = "none";
                    }
                    data.timestamp = Date.now();
                } else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                   if(data) {
                        callback(null, data);
                   } else {
                        callback("Patient Update failed", null);
                   }
                });
            } else {
                callback("Patient not found in db", null);
            }
        });
    },

    assignQuarantine: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if (request.body.isQuarantine) {
                    data.qurantine.isQurantine = true;
                    data.qurantine.started = Date.now();
                    data.qurantine.end = data.qurantine.started + 1209600000;
                } else {
                    data.qurantine.isQurantine = false;
                    data.qurantine.started = "";
                    data.qurantine.end = "";
                }

                db.insert(data, function (err, data) {
                   if(data) {
                        callback(null, data);
                   } else {
                        callback("Patient Update failed", null);
                   }
                });
            } else {
                callback("Patient not found in db", null);
            }
        });
    },

    updateComment: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if(request.body) {
                    data.doctorscreening.push(request.body);
                } else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                   if(data) {
                        callback(null, data);
                   } else {
                        callback("Patient Update failed", null);
                   }
                });
            } else {
                callback("Patient not found in db", null);
            }
        });
    },

    updateCovidStatus: function (id, updatedFields) {
        return new Promise((resolve, reject) => {
            const patientDB = cloudant.db.use(patient_dbname);
            console.log('Updating record for Id-"%s"', id);

            patientDB.get(id, (err, data) => {
                if(err) {
                    reject(err);
                    return;
                }

                // Merging updated fields here
                data = merge(data, updatedFields);

                patientDB.insert(data, (err2, data2) => {
                    if(err2) {
                        reject(err2);
                        return;
                    }
                    resolve(data2);
                });
            });
        })
    }
};