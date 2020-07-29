"use strict";
var uuid = require("uuid-random");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
module.exports = {
  createGUI: function () {
    var str = uuid();
    var matches1 = str.match(/\d+/g);
    var _Gid = matches1.join().replace(/,/g, "").substring(1, 10);
    return _Gid;
  },
  createPWD: function () {
    var pwd = uuid().substring(1, 8);
    return pwd;
  },

  // Nodejs encryption with CTR
  encrypt: (text) => {
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  },

  decrypt: (text) => {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },

  convertStatustoTemperature: (temperature) => {
    switch (temperature) {
      case "normal":
        return 97;
        break;
      case "medium":
        return 100;
        break;
      case "fever":
        return 102;
        break;
      case "highfever":
        return 105;
        break;
      default:
        return 97;
    }
  },

  updateUserDetails: function (data, payload) {
    data["name"] = payload.name;
    data["age"] = payload.age;
    data["gender"] = payload.gender;
    data["location"] = payload.location;
    data["mobileno"] = payload.mobileno;
    if (payload.imageUrl) {
      data["imageUrl"] = payload.imageUrl;
    }
    data["emergencyContactNumber"] = payload.emergencyContactNumber;

    return data;
  },

  uniqueFileName: function (fileName) {
    var result = "";
    var length = 8;
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getBase64Prefix: function () {
    return "data:image/jpeg;base64,";
  },

  updateOtpDetails: function (data, payload) {
    var data1 = data.otpRequestDetails;
    data1["request_id"] = payload.request_id;
    data1["isSuccess"] = payload.isSuccess;
    data1 ["timestampOtp"]=payload.timestampOtp ;
    data1 ["timestampAppLock"]= payload.timestampAppLock;
    data1 ["error_text_gen"]= payload.error_text_gen;
    data ["otpRequestDetails"] = data1;
    return data;
  },

  updateCount: function (data, payload) {
    var data1 = data.otpRequestDetails;
    data1["count"] = payload.count;
    data1["isSuccess"] = payload.isSuccess;
    data1 ["error_text"]= payload.error_text_gen;
    data1 ["timestampAppLock"]= payload.timestampAppLock;
    data ["isVerifiedUser"] = payload.isVerifiedUser;
    data ["otpRequestDetails"] = data1;

    return data;
  },
};
