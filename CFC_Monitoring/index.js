const express = require('express'),
http = require('http');
const socketIo = require("socket.io");
const eventEmitter = require('./common')


const bodyParser = require('body-parser');
const patientRouter = require('./routes/patientRouter');
const authRouter = require('./routes/authRouter');
const doctorRouter = require('./routes/doctorRouter');
var cors = require('cors');
const service = require('./routes/service');

const port = 8080;

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
const io = socketIo(server);
service.defaultAdmin(this);
server.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

eventEmitter.on('AssignDoctor',(data) =>{
   console.log('Emitter')
}); 

const activeUsers = new Set();


io.on("connection", (socket) => {
  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", function (data) {
    console.log('Updating comments for patient: ' + data.patientId + '\n');
    service.updateChat(data.patientId,data, function (err, data) {
        if(data) {            
        } else {
          console.log("failed");
        }
    });
    io.emit("chat message", data);
  });
  
  socket.on('register',(req)=>{
    service.getPatientByStatus(req.statusId, function (err, data) {
      if(data) {
        const filteredData = data.docs.filter(user => user.doctorId.length > 0 && user.assignedByOperator.isnewPatient === true);
        io.emit('get_all_patients',filteredData);
      } else {
      }
  });
  }
  );
  
  socket.on('updateNewStatus',(req,reqte)=>{
    service.updateNewStatus(req.patientId,reqte,function (err, data) {
      if(data) {
        io.emit('update_new_status',data);
      } else {
        console.log('error');
      }
  });
  }
  );
});
