const express = require('express'),
        http = require('http');

const bodyParser = require('body-parser');
const patientRouter = require('./routes/patientRouter');
const authRouter = require('./routes/authRouter');
const doctorRouter = require('./routes/doctorRouter');
var cors = require('cors');

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/login', authRouter);

app.use('/patients', patientRouter);

app.use('/doctors', doctorRouter);

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
