const MongoClient = require('mongodb').MongoClient;

async function main() {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  

  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Define the new room
    const newRoom = {
      "_id": "room1",
      "description": "A small room with a single wooden chair.",
      "exits": {
        "north": "room2",
        "south": "room3"
      },
      "ASCIIArt": "..."
    };

    // Insert the new room
    const result = await client.db("dungeon").collection("rooms").insertOne(newRoom);
    console.log(`New room created with the following id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
