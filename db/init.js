// db/init.js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Initialize database
const db = new Database(dbPath);

// Load and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('Database initialized with schema.');

//create default user for development
const userExists = db.prepare(`SELECT 1 FROM users LIMIT 1`).get();
if (!userExists) {
  const createUser = db.prepare(`
    INSERT INTO users (username, email, password) 
    VALUES (?, ?, ?)
  `);
  createUser.run('default_user', 'default@example.com', 'default1234');
  console.log('Default user created for development.');
}

module.exports = db;
