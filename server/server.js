

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require('path');
const fs = require('fs');

// const mongoose = require('mongoose');

// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// // Call the async function to connect to MongoDB
// connectToMongoDB();


// const { Schema, model } = mongoose;

// const userBalanceSchema = new Schema({
//   userId: { type: String, unique: true },
//   balance: Number,
// });

// const UserBalance = model('UserBalance', userBalanceSchema);

const db = require('./database');

const initializeUser = (username) => {
  const query = 'INSERT OR IGNORE INTO users (username, balance) VALUES (?, ?)';
  const params = [username, 10];

  db.run(query, params, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Initialized user ${username} with a balance of 10.`);
    }
  });
};

initializeUser('exampleUser');

app.get('/balance/:username', (req, res) => {
  const { username } = req.params;
  
  // Find the user in the database
  const user = db.get('users').find({ username }).value();

  if (!user) {
    // If the user is not found, initialize the user with a starting balance
    initializeUser(username);
    
    // Get the newly created user
    const newUser = db.get('users').find({ username }).value();
    
    // Return the user's balance
    res.json({ balance: newUser.balance });
  } else {
    // If the user is found, return the user's balance
    res.json({ balance: user.balance });
  }
});


app.get('/api/balance/:username', (req, res) => {
  const { username } = req.params;

  getUserBalance(username, (err, balance) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching balance.' });
    } else if (balance !== null) {
      res.status(200).json({ balance });
    } else {


      res.status(404).json({ error: 'User not found.' });
    }
  });
});


const getUserBalance = (username, callback) => {
  const query = 'SELECT balance FROM users WHERE username = ?';

  db.get(query, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else if (row) {
      console.log(`User ${username} has a balance of ${row.balance}.`);
      callback(null, row.balance);
    } else {
      console.log(`User ${username} not found.`);
      callback(null, null);
    }
  });
};

// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(express.static(__dirname + "/public"));

// const jargPath = path.join(__dirname, 'public', 'jarg');
app.get('/music', (req, res) => {
  fs.readdir(path.join(__dirname, 'public', 'snd'), (err, files) => {
    if (err) {
      res.status(500).send('Error reading snd directory');
    } else {
      res.json(files.filter(file => file.endsWith('.mp3')));
    }
  });
});

app.get('/poems', (req, res) => {
  fs.readdir(path.join(__dirname, 'public', 'poems'), (err, files) => {
    if (err) {
      res.status(500).send('Error reading poems directory');
    } else {
      res.json(files.filter(file => file.endsWith('.txt')));
    }
  });
});

app.get('/jarg-list', (req, res) => {
  fs.readdir(path.join(__dirname, 'public', 'jarg'), (err, files) => {
    if (err) {
      res.status(500).send('Error reading jarg directory');
    } else {
      res.json(files.filter(file => file.endsWith('.jarg')));
    }
  });
});




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


  // app.get('/api/users/:userId/balance', async (req, res) => {
  //   const { userId } = req.params;
  
  //   try {
  //     // If the user has no balance stored, initialize it
  //     await initializeUser(userId);
  
  //     const user = await UserBalance.findOne({ userId });
  
  //     res.json({ balance: user.balance });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'An error occurred while retrieving the balance.' });
  //   }
  // });

  
// const initializeUser = async (userId) => {
//   try {
//     const user = await UserBalance.findOne({ userId });

//     if (!user) {
//       const newUser = new UserBalance({
//         userId,
//         balance: 10,
//       });

//       await newUser.save();
//     }
//   } catch (err) {
//     console.error(err);
//     throw new Error('An error occurred while initializing the user.');
//   }
// };
  

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
