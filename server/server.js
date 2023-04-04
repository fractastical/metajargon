

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});


const { Schema, model } = mongoose;

const userBalanceSchema = new Schema({
  userId: { type: String, unique: true },
  balance: Number,
});

const UserBalance = model('UserBalance', userBalanceSchema);

// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(express.static(__dirname + "/public"));

// app.use(express.static("public"));

const visitedCubes = {};
const userBalances = {};


io.on("connection", (socket) => {
  console.log('A user connected');
  socket.emit('visitedCubes', visitedCubes);

  app.get('/', function(req, res){
      res.redirect('/public/index.html')
  ;

  });

  app.get('/api/users/:userId/balance', (req, res) => {
    const { userId } = req.params;

    // If the user has no balance stored, initialize it
    await initializeUser(userId);
  
    const user = await UserBalance.findOne({ userId });
  
    res.json({ balance: user.balance });
  });
    
  function initializeUser(userId) {
    try {
      const user = await UserBalance.findOne({ userId });
      if (!user) {
        await UserBalance.create({ userId, balance: 10 });
      }
    } catch (err) {
      console.error(err);
    }
    }
  

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
