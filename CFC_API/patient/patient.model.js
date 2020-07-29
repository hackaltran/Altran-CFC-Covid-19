

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
'use strict';


// load the Cloudant library
var async = require('async');
var Cloudant = require('@cloudant/cloudant');
const utility = require("../utility/utility");
const weightageService = require("../service/service");
const query = require("../db_query/query");
const moment= require('moment') 

//var cloudant = Cloudant({url: process.env.CLOUDANT_URL});
const cloudant = new Cloudant({ url: 'https://682168c0-dce4-4f2f-8069-dc20a8e90878-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'uBkoMYbyLraH_5Ax4eajkyAbXpGSDfrtlollhnmvs5MJ' } } });
var db = cloudant.db.use('c4c_db');;
var db_hosp = cloudant.db.use('c4c_hospital');
var doc = null;

var hourDiffPositive = 4;
var hourDiffPossible = 8;
var hourDiffNone     = 24;

module.exports = {
    // create a document
    createDocument: function (payloadData, callback) {
        var payloadData = {
            _id: utility.createGUI(), name: payloadData.name, gender: payloadData.gender, symptom: [],
            mobileno: payloadData.mobileno, location: payloadData.location, temprature: payloadData.temprature,
            iscovid: false, healthstatus: "none", doctorscreen: [], timestamp: Date.now(), doctorId: "", assignedByOperationId: ""
        };
        // we are specifying the id of the document so we can update and delete it later
        db.insert(payloadData, function (err, data) {
            callback(err, data);
        });
    },

    // read a document
    readDocument: function (id, callback) {
        db.get(id, function (err, data) {
            doc = data;
            callback(err, data);
        });
    },

    // update a document
    updateDocument: (payload, callback) => {
        var response = { success: false };
        var err = null;
        var mobno = payload.user_id.toString();

        if(!mobno.includes("+")){
                var plus = "+";
                mobno = plus.concat(mobno);
            }
            console.log("mobno=" + mobno);
        // payload.temperature = utility.convertStatustoTemperature(payload.temperature);
        payload["timestamp"] = Date.now();
        delete payload["user_id"];
        // make a change to the document, using the copy we kept from reading it back
        db.find(query.getuserData(mobno)).then(async (respData) => {// db.get(uid, async (err, data) =>{
            var data = respData.docs[0];
            if (data) {
                data.symptom.push(payload);
                var updatedField = await weightageService.updatePatientScore(null, data);
                if (updatedField != null) {
                    data.healthstatus = updatedField.healthstatus;
                    data.currentCovidScore = updatedField.currentCovidScore;
                    if (updatedField.qurantine != undefined)
                        data.qurantine = updatedField.qurantine;
                }
                db.insert(data, function (err, data) {
                    if (data) {
                        response["success"] = true;
                        callback(err, response);
                    }
                    else {
                        callback(err, response);
                    }
                });
            }
            else {
                callback(err, response);
            }

        });
    },

    // deleting a document
    deleteDocument: function (callback) {
        // supply the id and revision to be deleted
        db.destroy(doc._id, doc._rev, function (err, data) {
            //   console.log('Error:', err);
            // console.log('Data:', data);
            callback(err, data);
        });
    },

    // deleting the database document
    deleteDatabase: function (callback) {
        // console.log("Deleting database '" + dbname + "'");
        cloudant.db.destroy(dbname, function (err, data) {
            callback(err, data);
        });
    },
    selectQuery: function () {
        db.find(query.searchQuery()).then((result) => {
            //console.log(result.docs);
        });;
    },
    findsymptom: function (id, callback) {
        db.find(query.getSymptom(id)).then((result) => {
            if (result.docs.length > 0 && result.docs[0].symptom.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        }).catch(err => {
            callback(err);
        });
    },
    getUserName: (id, callback) => {
        db.find(query.getSignIn(id)).then((result) => {
            console.log("Response for get User Name function =>" + JSON.stringify(result));
            if (result.docs.length > 0) {
                callback("", { "sucess": "true", userName: result.docs[0].name, userId: result.docs[0]._id });
            }
            else {
                callback("", { "sucess": "false" });
            }
        }).catch(err => {
            callback(err, { "sucess": "false" });
        });
    },
    updateSOS: (obj, callback) => {
        if(!obj.sosStatus){
            obj.data.isSosRaised = true;
            obj.data.history.push({comment:'SOS Raised',subComment:obj.reason,timestamp:Date.now(),user:'',patientId: obj.data._id});
        }else{
            obj.data.isSosRaised = false;
            obj.data.history.push({comment:'SOS Cancelled',subComment:obj.reason,timestamp:Date.now(),user:'',patientId: obj.data._id});
        }
        db.insert(obj.data, function (err, data) {
            if (data) {
                callback({ "success": true, "msg": "SOS Raised Api called" });
            }
            else {
                callback({ "success": false, "msg": "SOS Raised Api not called" });
            }
        });
    },
    // update a document
updateUserSymptom: (payload, callback) => {
    var response = { success: false };
    var err = null;
    var mobno = payload.user_id.toString();
    
    // make a change to the document, using the copy we kept from reading it back
    db.find(query.getuserData(mobno)).then(async (respData) => {
        var data=respData.docs[0];
        if (data) {
            var lastData = data.symptom.pop(); 
            var times = lastData.timestamp;
            var temperature ,heartRate ;
            if(payload.isAddBodyTemp){
                temperature =  payload.bodyTemp.toString();
                heartRate = lastData.heart_rate;
            }else{
                temperature = lastData.temperature;
                heartRate = payload.bodyTemp.toString();
            }

            require("moment-duration-format");
            var extend = require('util')._extend;

            var now = new Date();
            var then = new Date(times);

            var dateDiff = moment(now,"DD/MM/YYYY hh:mm:ss").diff(moment(then,"DD/MM/YYYY hh:mm:ss"));
            var hourDiff = moment.duration(dateDiff).format("hh");

            var isUpdate = false;
            if(data.healthstatus ==='positive'){
                isUpdate = hourDiff >= hourDiffPositive ? false : true;
            }else if (data.healthstatus ==='possible') {
                isUpdate = hourDiff >= hourDiffPossible ? false : true; 
            } else if(data.healthstatus ==='none'){
                isUpdate = hourDiff >= hourDiffNone ? false : true;
            }

            if(isUpdate){
                lastData.temperature = temperature;
                lastData.heart_rate = heartRate;
                lastData.timestamp = Date.now();
                data.symptom.push(lastData);
            }else{
                var recentData =  JSON.parse(JSON.stringify(lastData));
                data.symptom.push(lastData);                
                recentData.timestamp = Date.now();
                recentData.temperature = temperature;
                recentData.heart_rate = heartRate;
                data.symptom.push(recentData);
            }

            var updatedField = await weightageService.updatePatientScore(null, data);
                if (updatedField != null) {
                    data.healthstatus = updatedField.healthstatus;
                    data.currentCovidScore = updatedField.currentCovidScore;
                    if(updatedField.qurantine != undefined)
                      data.qurantine = updatedField.qurantine;
                }
            db.insert(data, function (err, data) {
                if (data) {
                    response = {
                        success: true
                    }
                    callback(err, response);
                }
                else {
                    callback(err, response);
                }
            });
        }
        else {
            callback(err, response);
        }
     });
},

    readFromHospitalConfigDb: (callback)=> {
        db_hosp.list({include_docs:true}, function (err, data) {
            callback(err, data.rows[0].doc);
          });
    }
};
