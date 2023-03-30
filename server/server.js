

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require('path');

app.use(express.static("public"));

const visitedCubes = {};

io.on("connection", (socket) => {
  console.log('A user connected');
  socket.emit('visitedCubes', visitedCubes);

app.get('/', function(req, res){
    res.redirect('/public/index.html')
;
});


  socket.on("sceneUpdate", (data) => {
    socket.broadcast.emit("sceneUpdate", data);
  });

  // In server.js, inside the "connection" event
  socket.on("cubeVisited", (cubeId) => {

    visitedCubes[cubeId] = true;
    io.emit("cubeVisited", cubeId);
    if (visitedCubes.length > 500)
    {
      visitedCubes = {};
      io.emit('visitedCubes', visitedCubes);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
