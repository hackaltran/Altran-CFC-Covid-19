// Copyright © 2015, 2017 IBM Corp. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
"use strict";

// load the Cloudant library
var async = require("async");
var Cloudant = require("@cloudant/cloudant");
const query = require("../db_query/query");
const weightageService = require("../service/service");
const utility = require("../utility/utility");
const cloudant = new Cloudant({ url: 'https://682168c0-dce4-4f2f-8069-dc20a8e90878-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'uBkoMYbyLraH_5Ax4eajkyAbXpGSDfrtlollhnmvs5MJ' } } });
var db = cloudant.db.use('c4c_db');

var db_hospital = cloudant.db.use('c4c_hospital');
var db_doctor = cloudant.db.use('c4c_doctor');
var doc = null;

module.exports = {
  // create a document
  createDocument: function (payloadData, callback) {

    var pwd = utility.createPWD();
    var encryptedPwd = utility.encrypt(pwd);
    var qurantineData = { "isQurantine": false, "started": 0, "end": 0 };
    var sosAssignData = { "id": "", "comments": "","name": "" ,timestamp:null};
    var payloadData = {
      _id: utility.createGUI(), name: payloadData.name, gender: payloadData.gender,
      emergencyContactNumber:"",
      age: payloadData.age, mobileno: payloadData.mobileno, location: payloadData.location, currentAssign: "none",
      morbidity: "none", isTestPerformed: true,
      password: encryptedPwd, symptom: [], iscovid: false, healthstatus: "none", history : [],
      timestamp: Date.now(), doctorId: "", assignedByOperator: {}, assignedByDoctor: {}, usertype: "individual",
      qurantine: qurantineData, currentCovidScore: "", isSosRaised: false, doctorscreening:[],isVerifiedUser: false

    };

    db.insert(payloadData, function (err, data) {
      var response = {};
      if (data) {
        response["success"] = true;
        response["userId"] = data.id;
        response["mobileno"] = payloadData.mobileno;
        response["password"] = pwd;
      } else {
        response["success"] = false;
      }
      callback(err, response);
    });
  },

  // read a document
  readDocument: (userId, callback) => {
    if (userId != undefined && userId != null) {
      db.get(userId, async function (err, data) {
        if (data !== undefined) {
          data["userId"] = data._id.toString();
          if (data.imageUrl) {
            data.imageUrl = utility.getBase64Prefix() + data.imageUrl;
          }

          delete data._id;
          delete data.password;
          delete data._rev;
          db_hospital.list({ include_docs: true }, function (err, data1) {
            if (!data1) {
              callback(err, data);
              return;
            }
            var res = data1.rows[0].doc;
            var hospital = {
              "hospitalName": res.hospitalName,
              "positiveStatus": res.positiveStatus,
              "possibleStatus": res.possibleStatus,
              "noneStatus": res.noneStatus
            }
            data["hospital"] = hospital;

            if (data.doctorId) {
              db_doctor.get(data.doctorId, function (errror, response) {
                if (response) {
                  var doctorDetails = {
                    "id": response._id,
                    "name": response.name
                  }
                  data["doctor_details"] = doctorDetails;
                }
                callback(errror, data);
                return;
              });
            } else {

              callback(err, data);
              return;
            }
          });
        } else {
          callback(err, { msg: "no records found !!! " });
        }
      });
    }
  },

  updateDocument: (userId, payload, callback) => {
    var response = { success: false };
    var err = null;
    if (userId != undefined && userId != null) {
      db.get(userId, async function (err, data) {
        if (data !== undefined) {
          data = utility.updateUserDetails(data, payload);
        
          db.insert(data, function (err, data) {
            if (data) {
              response["success"] = true;
              callback(err, data);
            } else {
              callback(err, response);
            }
          });
        } else {
          callback(err, { msg: "no records found !!! " });
        }
      });
    }
  },

  updateOtpDetails: (callback) => {
    var response = { success: false };
    var err = null;
    db_hospital.list({ include_docs: true }, function (err, data1) {
      if (!data1) {
        callback(err, data1);
        return;
      }
      var res = data1.rows[0].doc;
      var otpDetails = {
        "otpExpiryTime": res.otpExpiryTime,
        "maxOtpAttempts": res.maxOtpAttempts,
        "otpAppLockTime": res.otpAppLockTime,
        "otpLockhelplineNum": res.otpLockhelplineNum,
      }
      var hospital = {
          "hospitalName": res.hospitalName,
        "positiveStatus": res.positiveStatus,
  "possibleStatus": res.possibleStatus,
  "noneStatus": res.noneStatus,
      }
  
      callback(err, otpDetails, hospital);
});
    },


    updateOtpDetailsDB: function(userId,payload, callback){
      if (userId != undefined && userId != null) {
        db.get(userId, async function (err, data) {
          if (data !== undefined) {
            if(data.otpRequestDetails){
             
              data = utility.updateOtpDetails(data, payload);
            }
            else{
              var otpRequestDetails = { "request_id": payload.request_id, "count": payload.count ,"error_text_gen":payload.error_text_gen,
               "isSuccess": false,"timestampAppLock":payload.timestampAppLock,"timestampOtp":payload.timestampOtp };
              data ["otpRequestDetails"] = otpRequestDetails;
            }
            db.insert(data, function (err, data) {
              if(data)
              {
              
                callback("",data);
              }
             else{
              
               callback(err, {msg: "something went wrong !!!" });
             }
           });
          
          }
        });
      }

    },

    updateVerifyDetails: function(userId, payload, callback)
    {
      if (userId != undefined && userId != null) {
        db.get(userId, async function (err, data) {
          if (data !== undefined) {
            if(data.otpRequestDetails)
            {
              data = utility.updateCount(data, payload);
            }
            db.insert(data, function (err, data) {
              if(err)
              {
              }
              else{
                var data = data;
              }
            
           });
           callback("", data);
          }
          else {
            callback(err, { msg: "no records found !!! " });
          }
        });
      }
    },

  authentication: function (payload, callback) {
    db.find(query.getSignIn(payload.id))
      .then((result) => {
        if (result.docs.length > 0) {
          callback("", {
            userId: result.docs[0]._id,
            mobileno: result.docs[0].mobileno,
            success: true,
            symptomDataLen: result.docs[0].symptom.length,
          });
        } else {
          callback(err, { userId: payload.id, success: false });
        }
      })
      .catch((err) => {
        callback(err, { userId: payload.id, success: false });
      });
  },

  getUserDataMobile: function(mobileno, callback)
  {
    db.find(query.getuserData(mobileno))
      .then((result) => {
        if (result.docs.length > 0) {
          var data=result.docs[0];
          // data = result.docs;
          data["userId"] = data._id.toString();
          if (data.imageUrl) {
            data.imageUrl = utility.getBase64Prefix() + data.imageUrl;
          }

          delete data._id;
          delete data.password;
          delete data._rev;
          callback("", data);
        } else {
          callback(false);
        }
      })
  },

  getUserName: (payload, callback) => {
    db.find(query.getUserName(id))
      .then((result) => {
        if (result.docs.length > 0) {
          callback({
            sucess: "true",
            userName: result.docs[0].name,
            userId: result.docs[0]._id,
          });
        } else {
          callback(false);
        }
      })
      .catch((err) => {
        callback(err);
      });
  },
};
