const patient = require("./patient.model");
const cloudant = require('@cloudant/cloudant');
var uuid = require('uuid-random');
const { response } = require("express");

module.exports = {
    delete: (request, response) => {

    },
    add: (request, response) => {
        var payloadData = {
            name: request.body.name, gender: request.body.gender, symptom: [], timestamp: Date.now(),
            mobileno: request.body.mobileno, location: request.body.location, temprature: request.body.temprature
        }
        patient.createDocument(payloadData, function (err, data) {
            response.send(data);
        });
    },

    updatePatients: (request, response, next) =>{
        

    },

    readPatient: (request, response, next) => {
        var patientid = request.params.patientid;
        patient.readDocument(patientid, function (err, data) {
            response.send(data);
        });
    },
    covidpatient: (request, response, next) => {
        // patient.readDocument(function (err, data) {
       // console.log(JSON.stringify(request.body))
        //response.send(JSON.stringify(request.body));
        // });
    },
    addsymptom: (request, response, next) => {
        var payload = request.body;
        console.log("RequestData for Add Symptom => "+JSON.stringify(request.body));
        if (payload["isverified"] == undefined) {
            patient.updateDocument(payload, function (err, data) {
                response.send(data);
            });
        }
        else {
            var id = request.body.user_id.toString();

            if(!id.includes("+")){
                var plus = "+";
                id = plus.concat(id);
            }
            console.log("id=" + id);

            patient.getUserName(id, function (err, data) {
                {
                    response.send(data);
                }
            });
        }
    },

    findUser: (request, response) => {
       // console.log("controller calling");
        patient.selectQuery();
        response.send({ "success": true });
    },
    findsymptom: (request, response) => {
        var userId = request.body.id;
        var result = patient.findsymptom(userId, function (result) {
            response.send({ "success": result });
        });


    },
    updatesymptom: (request, response, next) => {
        var payload = request.body;
        console.log("RequestData for update Symptom => "+JSON.stringify(request.body));
        if (payload["isverified"] == undefined) {
            
            patient.updateUserSymptom(payload, function (err, data) {
                response.send(data);
            });
        }
        else {
            var id = request.body.user_id.toString();
            console.log(JSON.stringify(request.body));
            console.log("trilok test is not veryfied");
            patient.getUserName(id, function (err, data) {
                {
                    response.send(data);
                }
            });
        }
    },

    findUser: (request, response) => {
       // console.log("controller calling");
        patient.selectQuery();
        response.send({ "success": true });
    },
    findsymptom: (request, response) => {
        var userId = request.body.id;
        var result = patient.findsymptom(userId, function (result) {
            response.send({ "success": result });
        });

    },
    raiseSOS: (request, response) => {
        let payloadData = {patientId:request.body.id , reason: request.body.reason,sosStatus: request.body.sosStatus}
        patient.readDocument(payloadData.patientId, function (err, data) {
            if (data) {
                    let obj = { data: data, reason: payloadData.reason,sosStatus:payloadData.sosStatus }
                    patient.updateSOS(obj, function (result) {
                        response.send({ "res": result });
                    })
            }
            else response.send(err);
        });
    },
    sosStatus: (request,response) => {
        let patientId = request.params.patientid;
        patient.readDocument(patientId, function (err, data) {
            if (data) {
                patient.readFromHospitalConfigDb(function(err,res){
                    if(data.healthstatus === 'positive'){
                        data.helplineNumber = res.emergencyHelplineNumber;
                    }else{
                        data.helplineNumber = res.helplineNumber;
                    }
                    response.send({ "res": data }); 
                });
                 //response.send({ "res": data }); 
            }
            else response.send(err);
        });
    }
};
