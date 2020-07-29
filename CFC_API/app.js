const express = require('express');
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');
const path = require("path");
app.use('/static', express.static(path.join(__dirname, 'images')))


const patientRoutes = require('./patient/patient.route');
const userRoutes = require('./user/user.route');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors())
//app.use(morgan('dev'));
app.use('/api/patient/', patientRoutes);
app.use('/api/user/', userRoutes);
app.post('/api/user/', userRoutes);



app.use((req, res, next) => {
  const error = new Error('Not Found');
 // error.status = 404;
  console.log(error);
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message || 'Server Error'
    }
  });
});



module.exports = app;