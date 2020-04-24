'use strict';

module.exports = {
    searchQuery: function () {
        return {
            "selector": {
                "usertype": "individual"
            },
            "fields": [
                "_id", "name"
            ]
        };
    },
    getSymptom: function (id) {
        return {
            "selector": {
                "_id": id
            },
            "fields": [
                "_id",
                "symptom"
            ]
        };
    },
     getUserName: function (id) {
        return {
            "selector": {
                "_id": id
            },
            "fields": [
                "_id",
                "name"
            ]
        };
    },
     getSignIn: function (mobileno) {
        return {
            "selector": {
               "mobileno": mobileno
            },
            "fields": [
                "_id",
                "_rev",
                "name",
                "mobileno",
                "symptom"
            ]
        }
     },
         getuserData: function (mobileno) {
        return {
            "selector": {
               "mobileno": mobileno
            }
        };
    }
}