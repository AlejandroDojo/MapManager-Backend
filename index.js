// Imports
const express = require("express");
const cors = require("cors");
const http = require('http');
const EventRoutes = require('./routes/event.routes')
const UserRoutes = require('./routes/user.routes')
// Definicion de app y sockets.
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
//requerimos la base de datos
require('./config/mongoose.config');
// Usando parámetros de entorno.
require('dotenv').config()




//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//le pasamos la app a nuestra ruta
EventRoutes(app);
UserRoutes(app);

// Conexiones de Soket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // Load event handlers
  require('./sockets/socker.controller')(socket, io);
});

server.listen(process.env.PORT, () => {
  console.log("Activo en el puerto 8080");
});