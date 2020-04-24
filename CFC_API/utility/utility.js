'use strict';
var uuid = require('uuid-random');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
module.exports = {
    createGUI: function () {
        var str = uuid();
        var matches1 = str.match(/\d+/g);
        var _Gid = matches1.join().replace(/,/g, '').substring(1, 10);
        return _Gid;
    },
    createPWD: function () {
        var pwd = uuid().substring(1, 8);
        return pwd;
    },

    // Nodejs encryption with CTR
    encrypt: (text) => {
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    },

    decrypt: (text) => {
        let iv = Buffer.from(text.iv, 'hex');
        let encryptedText = Buffer.from(text.encryptedData, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
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
    }
}