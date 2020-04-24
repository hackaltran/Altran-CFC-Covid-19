'use strict';

module.exports = {
    searchCovidPossible: function () {
        return {
            "selector": {
                "healthstatus": "possible"
            }
        };
    },
    
    searchCovidPositive: function () {
        return {
            "selector": {
                "healthstatus": "positive"
            }
        };
    },

    searchAllForDoctor: function (doctorId) {
        return {
            "selector": {
                "doctorId": doctorId
            }
        };
    },

    searchPositiveForDoctor: function (doctorId) {
        return {
            "selector": {
                "doctorId": doctorId,
                "healthstatus":"positive"
            }
        };
    },

    searchPossibleForDoctor: function (doctorId) {
        return {
            "selector": {
                "doctorId": doctorId,
                "healthstatus":"possible"
            }
        };
    },
    
    findByPatientId: function (patientId) {
        return {
            "selector": {
                "_id": patientId
            }
        };
    },

    findCommentsByPatientId: function (patientId) {
        return {
            "selector": {
                "_id": patientId
            },
            "fields": [
                "doctorscreening"
            ]
        };
    }, 

    getAllPatients: function () {
        return {
            "selector": {
            }
        };
    },

    getAllDoctors: function () {
        return {
            "selector": {
                "usertype": "doctor"
            },
            "fields": [
                "_id", "name"
            ]
        };
    }
}