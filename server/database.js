const sqlite3 = require('sqlite3').verbose();

// Open the database connection
const db = new sqlite3.Database('./data.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create a table if it doesn't exist
const createTable = () => {
  const query = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    balance INTEGER NOT NULL
  );`;

  db.run(query, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Table created or already exists.');
    }
  });
};

createTable();

module.exports = db;
