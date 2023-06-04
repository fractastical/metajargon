

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require('path');
const fs = require('fs');
const util = require('util');

const MongoClient = require('mongodb').MongoClient;

// const {Configuration, OpenAIApi} = require('openai');

const {Configuration, OpenAIApi} = require('openai');


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




app.post('/generateDungeonRoom', async (req, res) => {

  const name = req.body.name;
  const direction = req.body.direction;
  const entrance = req.body.entrance;

  const prompt = 'Describe a room in a dungeon crawling game with the name "' + name + '". Include one unique object in that room. For result only return json format such as this:        The resulting JSON object should be in this format: [{"name":"string","description":"string"},"asciiArt":"string","unique_object":"string","exits":{ "north":"string"}, "south":"string", "east":"string", "west":"string"} ].';

  const url = process.env.MONGODB_URL;
  const mongoClient = await connectToCluster(url);

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": prompt}],
      max_tokens: 120,
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

      console.log(newRoom["name"]);

      console.log(newRoom);

      let name;
      let description;
      let asciiart;
      let exits;
    
      const newRoomJson = {
        name: name,
        description: "cool room",
        exits: {},
        asciiart: "" // Set the appropriate value for the asciiart property
      };

      let jsonData;

      try {

        jsonData = JSON.parse(newRoom);

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
        "error": error,
        data: newRoom
      };
      const result = await errorcollection.insertOne(errorJson);

    
        console.log(error);
      } 
      console.log(newRoom["name"]);

      // const jsonData = JSON.parse(newRoom);

      console.log(newRoom);

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

    // const response = await openai.createCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: inputs, // Use the messages parameter
    //   max_tokens: 100,
    //   temperature: 0.7,

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": prompt}],
      max_tokens: 50,
      temperature: 0.6,
    });
    
    
    res.status(200).json({ joke: completion.data.choices[0].message.content });
    console.log(res);

    // const joke = completion.choices[0].text.trim();
    // res.json({ joke: joke });
  
    // res.status(200).json({ result: completion.data.choices[0].text });
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

  // const response = await openai.Completion.create({ // Update this line
  //   engine: 'davinci-codex',
  //   prompt: prompt,
  //   max_tokens: 50,
  //   n: 1,
  //   stop: null,
  //   temperature: 0.7,
  // });
  
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

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


