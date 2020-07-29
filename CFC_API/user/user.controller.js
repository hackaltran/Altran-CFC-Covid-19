const user = require("./user.model");
const querystring = require("querystring");
var multer = require("multer");

var multiparty = require("multiparty");
const http = require("http");
const path = require("path");
const fs = require("fs");
const utility = require("../utility/utility");
const imageThumbnail = require('image-thumbnail');
const Nexmo = require('nexmo');
const { request } = require("https");
const { response } = require("../app");

const nexmo = new Nexmo({
  apiKey: '05708d4d',
  apiSecret: '1KMz0pbEwDBLOzKV',
});


module.exports = {
  deleteUser: (request, response) => {},

  addUser: (request, response) => {
    var payloadData = {
      name: request.body.name,
      gender: request.body.gender,
      age: request.body.age,
      emergencyContactNumber: request.body.emergencyContactNumber,
      mobileno: request.body.mobileno,
      location: request.body.location,
    };
    user.createDocument(payloadData, function (err, data) {
      response.send(data);
    });
  },

  updateUser: async (request, response, next) => {
    var userId = request.params.userId;
    var photo = request.file;
    var filename = "";
    var isSuccessFile = false;
    var obj = JSON.parse(request.body.data);
    if (photo) {
      let options = {percentage: 25,responseType: 'base64' }
      const tempPath = request.file.path;
      var ext = path.extname(request.file.originalname).toLowerCase();
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        try {
        filename = await imageThumbnail(tempPath, options);
        } catch (err) {
          err = {msg: "Something went wrong!"};
          response.send(err);
        }
    }
    else{
      err = {msg: "Invalid file format"};
      response.send(err);
    }
}
    var payloadData = {
      name: obj.name,
      gender: obj.gender,
      age: obj.age,
      mobileno: obj.mobileno,
      location: obj.location,
      emergencyContactNumber: obj.emergencyContactNumber,
    };
   if (filename) {
      payloadData["imageUrl"] = filename;
    }
    user.updateDocument(userId, payloadData, function (err, data) {
      if (data) response.send(data);
      else response.send(err);
    });
  },

  getUser: (request, response, next) => {
    var userId = request.params.userId;
    user.readDocument(userId, function (err, data) {
      if (data) {
       user.updateOtpDetails( function (err1, otpDetails, healthstatus) {
        if (otpDetails) {
          data["otpDetails"] = otpDetails;
          data["healthStatus"]= healthstatus;
        response.send(data);
      }
      });
     
    }
      else response.send(err);
    });
  },

  signIn: (request, response, next) => {
    var mobileNum = "+";
    var id = mobileNum.concat(request.body.id);
    if (request.body.id != null && request.body.password != null) {
      
      
      var payloadData = {
        id: id,
        password: request.body.password,
      };
      user.authentication(payloadData, function (err, data) {
        response.send(data);
      });
    }
  },

  ///get user name against userId
  getUserName: (request, response, next) => {
    var payloadData = {
      id: request.body.id,
    };
    user.getUserName(payloadData, function (err, data) {
      response.send(data);
    });
  },

  //upload image
  uploadImage: (request, response, next) => {
    var payload = {
      image: request.body.image,
    };
  },
  download: (request, upload, callback) => {
    var url = request.url;
    request.head(url, (err, res, body) => {
      request(url).pipe(fs.createWriteStream(path)).on("close", callback);
    
    });
  },


  //generateOtp for mobile
  generateOtpMobile: async (request, response, next) => {
    var mobileNum = request.params.MobileNum;
     nexmo.verify.request({
      number: mobileNum,
      brand: 'AYWA-Covid',
      code_length: '4',
      pin_expiry:300,
      workflow_id: 4,  
    },
   (err, result) => {
     if(result.status ==0){
    var payload = {
      request_id :result.request_id,
      error_text_Gen : result.error_text,
      count: 0,
      timestampOtp:request.body.timestampOtp,
      timestampAppLock:0,
      isSuccess: false,
    };

   var userId =request.body.userId;
      user.updateOtpDetailsDB(userId, payload, function(err, data){
        if(err){
        
          response.send(err);
        } 
      else{
      
        data["request_id"]= result.request_id;
        data["error_text"]=  result.error_text;
       
        response.send(data);
      }
      })
      }
      else{
        response.send({msg: result});
      }
     }
    
     );

 },

  //otp validation
  otpValidation: (request, response, next) =>{

    var userId = request.body.userId;
    var request_id = request.body.request_id;
    var code = request.body.code;
    nexmo.verify.check({
      request_id: request_id,
      code: code
    },
     (err, result) => {
      if(result.status ==0){
        var payload={
          isVerifiedUser: true , 
         isSuccess : true,
         timestampAppLock:request.timestampAppLock,
              }
        user.updateVerifyDetails(userId, payload, function(err, data)
        { 
          if(err){
          response.send(err);
          }else{
            result ["success"] = true;
            response.send(result);
          }

        })
        
      }
      else{ 
      var count = request.body.count;
      var timestampAppLock = request.body.timestampAppLock;
      var countIcr = count +1;
        var payload={
          count: countIcr,
          isSuccess : true,
          timestampAppLock:timestampAppLock,   
       }
        user.updateVerifyDetails(userId, payload, function(err, data)
        { if(err){
          response.send(err);
        }
          else{
            result ["success"] = false;
            result ["count"] = countIcr;
            result ["timestampAppLock"] = timestampAppLock;
            response.send(result);
          }

        })
       
      }
      
    }
    );
  },

  getUserbyMobileNum:(request, response, next) =>{
   if(request.params.mobileNum){
      user.getUserDataMobile(request.params.mobileNum, function (err, data) {
        if (data) {
          user.updateOtpDetails( function (err1, otpDetails) {
           if (otpDetails) {
             data["otpDetails"] = otpDetails;
             response.send(data);
           
         }
         });
        
       }
       else{
         response.send(err);
       }
      
      });
    }
  },

};
