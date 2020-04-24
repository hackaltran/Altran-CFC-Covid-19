const user = require("./user.model");
const querystring = require('querystring');

module.exports = {
    deleteUser: (request, response) => {
    },

    addUser: (request, response) => {
        var payloadData = {
            name: request.body.name, gender: request.body.gender, age :request.body.age,
            mobileno: request.body.mobileno, location: request.body.location
        }
        user.createDocument(payloadData, function (err, data) {
            response.send(data);
        });
    },

    getUser: (request, response, next) => {
      var userId=  request.params.userid;
        user.readDocument(userId,function (err, data) {
            if(data) response.send(data);
            else  response.send(err);
        });
    },
    signin:(request, response, next)=>{
        if(request.body.id != null && request.body.password != null)
        {
        var payloadData = {
            id: request.body.id, password: request.body.password
        }
        user.authentication(payloadData, function (err, data) {
            response.send(data);
        }); 
    }
    },
    ///get user name against userId
    getUserName:(request, response, next)=>{
         var payloadData = {
            id: request.body.id
        }
        user.getUserName(payloadData, function (err, data) {
            response.send(data);
        });

    }

};
