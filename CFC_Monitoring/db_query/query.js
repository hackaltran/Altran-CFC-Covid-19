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

    searchEmail: function (mail) {
        return {
            "selector": {
                "email": mail
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
                "history"
            ]
        };
    }, 
    findChatByPatientId: function (patientId) {
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
    },
    getAllAdmin: function () {
        return {
            "selector": {
                "usertype": "admin"
            }
        };
    },
    getAllUser: function () {
        return {
            "selector": {
            },
            "fields": [
                "_id", "name","gender","mobileno","usertype","email"
            ]
        };
    }
}