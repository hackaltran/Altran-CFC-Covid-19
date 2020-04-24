const http = require('http');
//const socket = require('socket.io');

const app = require('./app');

var server  = http.createServer(app);
//var io      = socket.listen(server);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
