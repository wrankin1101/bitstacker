// db/queries.js
const db = require('./init');

module.exports = {
  createUser: (username, email) => {
    const stmt = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
    return stmt.run(username, email);
  },
  getUser: (userId) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(userId);
  },
  createPortfolio: (userId, name) => {
    const stmt = db.prepare('INSERT INTO portfolios (user_id, name) VALUES (?, ?)');
    return stmt.run(userId, name);
  },
  getPortfoliosForUser: (userId) => {
    const stmt = db.prepare('SELECT * FROM portfolios WHERE user_id = ?');
    return stmt.all(userId);
  },
  // Add similar helper functions for holdings, transactions, etc.
};
