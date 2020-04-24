const express = require('express');
const bodyParser = require('body-parser');
let service = require('./service');

const authRouter = express.Router();

authRouter.use(bodyParser.json());

authRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})
.post((req, res, next) => {
    console.log('Trying to login with username: ' + req.body.username + ' and password: ' + req.body.password);
    service.verifyUser(req, function (err, data) {
        if(data) {
            res.json(data);
            res.end();
        } else {
            res.statusCode = 401;
            res.end(err);
        }
    });
});

module.exports = authRouter;