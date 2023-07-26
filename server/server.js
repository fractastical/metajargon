

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require('path');
const fs = require('fs');
const util = require('util');
var passport = require('passport');
var session = require('express-session');
var passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;

const MongoClient = require('mongodb').MongoClient;
const {Configuration, OpenAIApi} = require('openai');

const port = process.env.PORT || 3000;


// Required to get data from user for sessions
passport.serializeUser((user, done) => {
  done(null, user);
 });
 passport.deserializeUser((user, done) => {
  done(null, user);
 });
 // Initiate Strategy
 passport.use(new SteamStrategy({
  returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
  realm: 'http://localhost:' + port + '/',
  apiKey: process.env.STEAMAPIKEY
  }, function (identifier, profile, done) {
   process.nextTick(function () {
    profile.identifier = identifier;
    return done(null, profile);
   });
  }
 ));
 app.use(session({
  secret: "blahblahe432",
  saveUninitialized: true,
  resave: false,
  cookie: {
   maxAge: 3600000
  }
 }))
 app.use(passport.initialize());
 app.use(passport.session());
 

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);
// console.log(process.env);

// console.log("key" + process.env.OPENAI_API_KEY);

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
//   });
  
// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const axios = require('axios');

// const cors = require('cors');
const bodyParser = require('body-parser');

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

//TODO: this appears to be broken now
// app.get('/', (req, res) => {
//   res.send(req.user);
//  });

 
 app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
  res.redirect('/')
 });

 //TODO: Doesn't work with generic error
 app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
  console.log("author returned");
  res.redirect('/')
 });
 
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

// openai.apiKey = process.env.OPENAI_API_KEY;


app.use(bodyParser.json()); // Add this line to use the body-parser middleware

async function connectToCluster(uri) {
  let mongoClient;

  try {
      mongoClient = new MongoClient(uri);
      console.log('Connecting to MongoDB Atlas cluster...');
      await mongoClient.connect();
      console.log('Successfully connected to MongoDB Atlas!');

      return mongoClient;
  } catch (error) {
      console.error('Connection to MongoDB Atlas failed!', error);
      process.exit();
  }
}


app.post('/allRooms', async (req, res) => {

  const keyword = req.body.keyword;
  const url = process.env.MONGODB_URL;
  const mongoClient = await connectToCluster(url);

  try {
    

      // Connect to the MongoDB cluster
      // const mongoClient = await connectToCluster(url);
      const db = mongoClient.db('dungeon');
      const collection = db.collection('dungeons');
      const allDungeons = await collection.find().toArray();

      console.log(allDungeons);
      console.log(`Successfully returned ${allDungeons.length} rooms`);
      res.status(200).json(JSON.stringify(allDungeons));

    } catch (err) {
      if (err.response) {
        console.error(err.response.status, err.response.data);
        res.status(err.response.status).json(err.response.data);
      } else {
        console.error(`Error with loading dungeons from MongoDB: ${err.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
      } finally {
      // Close the connection to the MongoDB cluster
      await mongoClient.close();
    }

  });


//TODO: this array forcing JSON parser actually returns a JSON format that MongoDB does not accept. If you want to learn about it Google "bson field" for a few hours. Probably could fix by popping out of Array.
  function parseRoomToJson(str) {
    let json;
    try {
        // Attempt to parse string to JSON
        json = JSON.parse(str);
    } catch (e) {
        console.log("Parsing error: ", e);
        return null;
    }

    // Check if the JSON object follows the right format
    if (Array.isArray(json)) {
        for (const item of json) {
            if (!('name' in item && typeof item.name === 'string') ||
                !('description' in item && typeof item.description === 'string') ||
                !('asciiArt' in item && typeof item.asciiArt === 'string') ||
                !('exits' in item && typeof item.exits === 'object')) {
                console.log("Invalid format: JSON does not match the required structure");
                return null;
            }
        }
    } else {
        console.log("Invalid format: Expected an array");
        return null;
    }

    return json;
}
  

app.post('/generateDungeonRoom', async (req, res) => {

  const name = req.body.name;
  const direction = req.body.direction;
  const entrance = req.body.entrance;
  const floor = req.body.floor;

  // const prompt = 'Describe a room in a dungeon crawling game with the name "' + name + '".  The resulting JSON object should be in this format: {"name":"string","description":"string"},"asciiArt":"string","exits":{ "north":"room name (if exists)"}, "south":"room name (if exists)", "east":"room name (if exists)", "west":"room name (if exists)"} }  The ascii art should represent a map of the room as seen from above.';
  const promptWithUniqueObject = 'Describe a room in a dungeon crawling game with the name "' + name + '".  The room should have a unique object. The resulting JSON object should be in this format: {"name":"string","description":"string"},"asciiArt":"string","unique_object":"string","exits":{ "north":"room name (if exists)"}, "south":"room name (if exists)", "east":"room name (if exists)", "west":"room name (if exists)"} }  The ascii art should represent a map of the room as seen from above and show where the unique object is in the room.';

  const url = process.env.MONGODB_URL;
  const mongoClient = await connectToCluster(url);

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": promptWithUniqueObject}],
      max_tokens: 360,
      temperature: 0.6,
    });
    
    

      // Connect to the MongoDB cluster
      // const mongoClient = await connectToCluster(url);
      const db = mongoClient.db('dungeon');
      const collection = db.collection('dungeons');

      // Insert jsonData into the collection

      let newRoom = completion.data.choices[0].message.content.trim();
      
      console.log(util.inspect(newRoom, { showHidden: false, depth: null }));
      console.log("util finished");

      let jsonData;


      try {

        jsonData = JSON.parse(newRoom);
        jsonData["floor"] = floor;
        
        // newRoomJson.description = newroom["description"];

      } catch (error) {

        // Refeed.
        // const completion = await openai.createChatCompletion({
        //   model: "gpt-3.5-turbo",
        //   messages: [{"role": "user", "content": "this gave an error "}],
        //   max_tokens: 50,
        //   temperature: 0.6,
        // });
        const errordb = mongoClient.db('dungeon');
        const errorcollection = db.collection('errors');
        const errorJson = {
        "type": "error",
        "error": error.message,
        data: newRoom

      };

        const result = await errorcollection.insertOne(errorJson);

        console.log(error);
      } 


      console.log(jsonData);

        // Create a new JSON object with the name property

      try {

        
        // newRoomJson = JSON.parse(newRoom);
        // newRoomJson["name"] = name;


      } catch (error) {
        console.error("Error parsing newRoom content as JSON:", error);


        return;
      }
      

      // console.log(newRoom.length);
      // console.log(newRoom);
      // console.log("parsing");

      // console.log("jsonified");

          // newRoom["exits"].
      // newRoom["exits"][direction] = entrance;
  //     if(! newRoom["exits"]) {}
  //     newRoom["exits"] = {};
  // newRoom["exits"][direction] = entrance;

      // console.log(newRoomJson);
      res.status(200).json({ room: jsonData });
      // console.log(res);

      const result = await collection.insertOne(jsonData);

      console.log(`Successfully inserted room with _id: ${result.insertedId}`);
    } catch (err) {
      if (err.response) {
        console.error(err.response.status, err.response.data);
        res.status(err.response.status).json(err.response.data);
      } else {
        console.error(`Error with OpenAI /MongDB request: ${err.message}`);
        // res.status(500).json({
        //   error: {
        //     message: 'An error occurred during your request.',
        //   }
        // });
      }
      } finally {
      // Close the connection to the MongoDB cluster


      await mongoClient.close();
    }

  });

  

function cleanJsonString(jsonString) {
    let firstCurly = jsonString.indexOf('{');
    let lastCurly = jsonString.lastIndexOf('}');
    let firstBracket = jsonString.indexOf('[');
    let lastBracket = jsonString.lastIndexOf(']');
    
    if (firstCurly !== -1 && lastCurly !== -1) {
      return jsonString.slice(firstCurly, lastCurly + 1);
    } else if (firstBracket !== -1 && lastBracket !== -1) {
      return jsonString.slice(firstBracket, lastBracket + 1);
    } else {
      throw new Error("Invalid JSON string");
    }
  }
  
    

app.post('/saveJoke', async (req, res) => {

       const myData = req.body.jsonData;

        // Connection URL

        const url = process.env.MONGODB_URL;
        const mongoClient = await connectToCluster(url);

        try {
          // Connect to the MongoDB cluster
          // const mongoClient = await connectToCluster(url);
          const db = mongoClient.db('jokes');
          const collection = db.collection('jokes');
          
      
          // Insert jsonData into the collection
          const result = await collection.insertOne(myData);
      
          console.log(`Successfully inserted item with _id: ${result.insertedId}`);
        } catch (err) {
          console.error('An error occurred while inserting data: ', err);
        } finally {
          // Close the connection to the MongoDB cluster
          await mongoClient.close();
        }

      });
      
  
  
app.post('/generateJoke', async (req, res) => {

  const keyword = req.body.keyword;
  const prompt = 'Generate a joke about ' + keyword + ' and rate its funniness and usefulness for learning on a scale from 1 to 10. For result only return json format with the following keys "text", "funniness_rating", "learning_rating"';

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": prompt}],
      max_tokens: 250,
      temperature: 0.6,
    });
  
    
    res.status(200).json({ joke: completion.data.choices[0].message.content });
    console.log(res);

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  
  }});



    
app.post('/metagame', async (req, res) => {

  const keyword = req.body.keyword;
  const prompt = '"' + keyword + '" is the name of a game.  If it can be returned in less than 50 lines of Javascript return this Javascript. Otherwise return "ERROR, game size too large" ';

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": prompt}],
      max_tokens: 250,
      temperature: 0.6,
    });
  
    
    res.status(200).json({ game: completion.data.choices[0].message.content });
    console.log(res);

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  
  }});

  

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
  
// try {
//   const response = await axios.post(API_URL,
//     {
//       prompt: 'Create a cube in three.js', // Replace with your prompt
//       max_tokens: 100,
//     },
//     {
//       headers: {
//         'Authorization': `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     }
//   );

//   const code = response.data.choices[0].text.trim();

//   // Archive the code by saving it to a file
//   const filePath = path.join(__dirname, 'archive.js');
//   fs.writeFileSync(filePath, code);

//   // Assuming the returned code is JavaScript, execute it using Node.js
//   exec(`node ${filePath}`, (error, stdout, stderr) => {
//     if (error) {
//       console.log(`Error: ${error.message}`);
//       return;
//     }

//     if (stderr) {
//       console.log(`stderr: ${stderr}`);
//       return;
//     }

//     console.log(`stdout: ${stdout}`);
//   });

//   res.send('Code executed and archived');
// } catch (error) {
//   console.error(error);
//   res.status(500).send('An error occurred');
// }
// });


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

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


