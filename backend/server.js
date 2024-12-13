const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/init'); // SQLite database instance
const queries = require('./db/queries')

const app = express();
const PORT = 4000;
const db = initializeDatabase();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/api/hello', (req, res) => {
    console.log('Dispatching singular "Hello"')
    res.json({ message: 'Hello from the server!' });
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
