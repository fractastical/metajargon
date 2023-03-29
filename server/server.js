

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const visitedCubes = new Set();

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sceneUpdate", (data) => {
    socket.broadcast.emit("sceneUpdate", data);
  });

  // In server.js, inside the "connection" event
  socket.on("cubeVisited", (cubeId) => {
    visitedCubes.add(cubeId);
    io.emit("cubeVisited", cubeId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
