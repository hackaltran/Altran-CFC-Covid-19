'use strict';

// External Imports
const { merge } = require('lodash');

// load the Cloudant library
var Cloudant = require('@cloudant/cloudant');
const query = require("../db_query/query");

const cloudant = new Cloudant({ url: 'https://682168c0-dce4-4f2f-8069-dc20a8e90878-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'uBkoMYbyLraH_5Ax4eajkyAbXpGSDfrtlollhnmvs5MJ' } } });
var patient_dbname = 'c4c_db';
var monitor_dbname = 'c4c_doctor';
var const_dbname = 'c4c_hospital';
var db = null;
var doc = null;

// create a database

module.exports = {

    // Authenticate a user
    verifyUser: function (request, callback) {
        console.log("Verifying user : ", request.body.username);
        db = cloudant.db.use(monitor_dbname);
        db.get(request.body.username, function (err, user) {
            if (user) {
                if (request.body.password == user.password) {
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
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    getPatientComments: function (patientId, callback) {
        console.log("Reading comments for patient : " + patientId);
        db = cloudant.db.use(patient_dbname);
        let dbquery = query.findCommentsByPatientId(patientId);
        console.log("query to database : ", dbquery);
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    getPatientChat: function (patientId, callback) {
        console.log("Reading comments for patient : " + patientId);
        db = cloudant.db.use(patient_dbname);
        let dbquery = query.findChatByPatientId(patientId);
        console.log("query to database : ", dbquery);
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    // Get patient details for doctor
    getPatientsForDoctor: function (statusCode, doctorId, callback) {
        console.log("Getting patients for doctor : " + doctorId + "with status : ", statusCode);
        db = cloudant.db.use(patient_dbname);
        var dbquery = null;
        if (statusCode == 101) {
            dbquery = query.searchPositiveForDoctor(doctorId);
        } else if (statusCode == 102) {
            dbquery = query.searchPossibleForDoctor(doctorId);
        } else {
            dbquery = query.searchAllForDoctor(doctorId);
        }
        console.log("query to database : ", dbquery);
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    // Get patient details by health status
    getPatientByStatus: function (statusCode, callback) {
        db = cloudant.db.use(patient_dbname);
        var dbquery = null;
        if (statusCode == 101) {
            dbquery = query.searchCovidPositive();
        } else if (statusCode == 102) {
            dbquery = query.searchCovidPossible();
        } else {
            dbquery = query.getAllPatients();
        }
        console.log("query to database : ", dbquery);
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    // Get all patients details
    getAllPatients: function (callback) {
        console.log("Listing all documents");
        db = cloudant.db.use(patient_dbname);
        db.list({ include_docs: true }, function (err, data) {
            callback(err, data);
        });
    },

    getAllDoctors: function (callback) {
        console.log("Listing all doctors");
        db = cloudant.db.use(monitor_dbname);
        let dbquery = query.getAllDoctors();
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    // Assign doctor to a patient
    assignDoctor: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if (request.body.doctorId && request.body.operatorId
                    && request.body.timestamp && request.body.operatorName) {
                    data.doctorId = request.body.doctorId;
                    data.assignedByOperator.id = request.body.operatorId;
                    data.assignedByOperator.timestamp = request.body.timestamp;
                    data.assignedByOperator.name = request.body.operatorName;
                    data.assignedByOperator.isnewPatient = request.body.isnewPatient;
                    data.currentAssign = "doctor";
                } else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                    if (data) {
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
                    if (data) {
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
                    if (data) {
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

    updateChat: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if (request) {                 
                    data.doctorscreening.push(request);
                } else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                    if (data) {
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
                if (request.body) {
                    data.history.push(request.body);
                    data.isSosRaised = false;
                }
                else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                    if (data) {
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
                if (err) {
                    reject(err);
                    return;
                }

                // Merging updated fields here
                data = merge(data, updatedFields);

                patientDB.insert(data, (err2, data2) => {
                    if (err2) {
                        reject(err2);
                        return;
                    }
                    resolve(data2);
                });
            });
        })
    },
    //Update SOS Alert
    updateNewStatus: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (err, data) {
            if (data) {
                if (request.body) {
                    data.assignedByOperator.isnewPatient = false;
                } else {
                    callback("Bad Request", null);
                }

                db.insert(data, function (err, data) {
                    if (data) {
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
    updateSOSStatus: function (patientId, request, callback) {
        db = cloudant.db.use(patient_dbname);
        db.get(patientId, function (error, data) {
            if (data) {
                if ((request.body.id && request.body.name && request.body.comments && request.body.timestamp)) {
                    data.sosAssign.id = request.body.id;
                    data.sosAssign.name = request.body.name;
                    data.sosAssign.comments = request.body.comments;
                    data.sosAssign.timestamp = request.body.timestamp;
                    data.sos.isRaised = false;
                } else {
                    callback(error, null);
                }
                db.insert(data, function (err, data) {
                    if (data) {
                        callback(null, data);
                    } else {
                        callback(error, null);
                    }
                });
            }
            else {
                callback("Patient not found in db", null);
            }
        });

    },

    verifyEmail: function (email, request, callback) {

        var constDB = cloudant.db.use(const_dbname);
        var allDataQuery = query.getAllPatients();

        var name = '';
        var dbpass = '';

        constDB.find(allDataQuery, function (error, res) {
            if (res) {
                var data = res.docs[0];
                if (data) {
                    name = data.email;
                    dbpass = Buffer.from(data.password, 'base64').toString('ascii');
                }
            }
        });

        db = cloudant.db.use(monitor_dbname);
        var dbquery = query.searchEmail(request.body.email);

        db.find(dbquery, function (err, respData) {
            if (respData && respData.docs.length > 0) {
                var data = respData.docs[0];
                var nodemailer = require('nodemailer');
                var htm = '<p>Dear ' + data.name + '</p>' +
                    '<p>Please click on the URL below to change your password for Are You Well online portal.</p>' +
                    '<a href=' + request.body.url + '?id=' + data._id + '> Click Here </a>' +
                    '<p>Please note, you cannot reply to this e-mail address.</p> ' +
                    '<p>This communication is confidential and intended solely for the addressee(s). Any unauthorized review, use, disclosure or ' +
                    'distribution is prohibited.If you believe this message has been sent to you in error, please notify the sender by replying ' +
                    'to this transmission and delete the message without disclosing it. Thank you.</p>' +
                    '<p>E-mail including attachments is susceptible to data corruption, interception, unauthorized amendment, tampering and viruses,' +
                    ' and we only send and receive emails on the basis that we are not liable for any such corruption, interception, amendment, ' +
                    'tampering or viruses or any consequences thereof.</p><br>'

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 456,
                    secure: true,
                    auth: {
                        user: name,
                        pass: dbpass
                    }
                });

                var mailOptions = {
                    from: 'no-reply <' + name + '>',
                    to: data.email,
                    subject: 'Reset password',
                    text: '',
                    html: htm
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        callback(null, data);
                    }
                });

            } else {
                var mess = {
                    "ERROR": "error message"
                }
                callback(mess, null);

            }
        });

    },

    resetPassword: function (_id, request, callback) {

        db = cloudant.db.use(monitor_dbname);
        db.get(_id, function (error, data) {
            if (data) {
                if (data._id === request.body.id) {
                    if (data.password === request.body.password) {
                        var errorMessage = {
                            error: 'New password can\'t be same as old password.',
                            responseCode: 'ERROR',
                            isOldPassword: true,
                            statusCode: 400
                        }
                        callback(null, errorMessage);
                        return;
                    } else {
                        data.password = request.body.password;
                        if (data.usertype === 'admin' || data.usertype === 'Admin') {
                            data.isFirstTimeLogin = false;
                        }
                    }
                } else {
                    callback(error, null);
                }
                db.insert(data, function (err, data) {
                    if (data) {
                        callback(null, data);
                    } else {
                        callback(err, null);
                    }
                });
            } else {
                callback(error, null);
            }
        });
    },

    // create a document
  creeateChatDocument: function (payloadData, callback) {
         var payloadData = {
             _id:payloadData.patientId,
             symptom: [], 
             doctorId: payloadData.doctorId,
         };
     db.insert(payloadData, function (err, data) {
       var response = {};
       if (data) {
         response["success"] = true;
       } else {
         response["success"] = false;
       }
       callback(err, response);
     });
   },
 
    // register default admin
    defaultAdmin: function (callback) {
        db = cloudant.db.use(monitor_dbname);
        let dbquery = query.getAllAdmin();
        db.find(dbquery, function (err, data) {
            if (data.docs.length <= 0) {
                const payloadData = {
                    _id: "1001001",
                    "name": "Admin",
                    "gender": "",
                    mobileno: "",
                    location: '',
                    usertype: "Admin",
                    "password": Buffer.from('Admin').toString('base64'),
                    "email": '',
                    isFirstTimeLogin: true,
                    otherInformation: ''
                }
                db.insert(payloadData, function (error, data) {

                });
            }
        });
    },

    // get all user of monitoring 
    getAllUsers : function(request,callback){
        db = cloudant.db.use(monitor_dbname);
        let dbquery = query.getAllUser();
        db.find(dbquery, function (err, data) {
            callback(err, data);
        });
    },

    signup: function (request, callback) {
        db = cloudant.db.use(monitor_dbname);
        var payloadData = {
            _id: request.body._id,
            name: request.body.name,
            gender: request.body.gender,
            age: request.body.age,
            mobileno: request.body.mobileno,
            location: request.body.location,
            usertype: request.body.usertype,
            password: request.body.password,
            email: request.body.email,
            isFirstTimeLogin: request.body.isFirstTimeLogin
        }

        db.insert(payloadData, function (error, data) {
            var response = {};
            if (data) {
                response["success"] = true;
                response["userId"] = data.id;
            } else {
                response["success"] = false;
            }
            callback(error, response);
        });
    }
};
