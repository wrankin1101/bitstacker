const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Function to initialize the database
function initializeDatabase(options = {}) {
  const { reset = false } = options;

  // If reset is true, delete the existing database file
  if (reset && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Existing database file deleted.');
  }

  // Create or connect to the database
  const db = new Database(dbPath);

  // Load and execute schema
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  console.log('Database initialized with schema.');

  // Create default user for development
  const userExists = db.prepare(`SELECT 1 FROM users LIMIT 1`).get();
  if (!userExists) {
    const createUser = db.prepare(`
      INSERT INTO users (username, email, password) 
      VALUES (?, ?, ?)
    `);
    createUser.run('default_user', 'default@example.com', 'default1234');
    console.log('Default user created for development.');
  }

  return db;
}

// Check if this script is being run directly
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'init':
      initializeDatabase();
      break;
    case 'reset':
      initializeDatabase({ reset: true });
      break;
    default:
      console.log('Usage: node db/init.js [init|reset]');
      process.exit(1);
  }
}

module.exports = {
  initializeDatabase
};