module.exports = {
  // User Queries
  createUser: (db, username, email, password) => {
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    return stmt.run(username, email, password);
  },
  getUserById: (db, id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },
  getUserByEmail: (db, email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },
  updateUser: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.username) {
      updateFields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.email) {
      updateFields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.password) {
      updateFields.push('password = ?');
      values.push(updates.password);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },
  deleteUser: (db, id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  },

  // Portfolio Queries
  createPortfolio: (db, userId, name) => {
    const stmt = db.prepare('INSERT INTO portfolios (user_id, name) VALUES (?, ?)');
    return stmt.run(userId, name);
  },
  getPortfoliosByUserId: (db, userId) => {
    const stmt = db.prepare('SELECT * FROM portfolios WHERE user_id = ?');
    return stmt.all(userId);
  },
  updatePortfolioName: (db, id, name) => {
    const stmt = db.prepare('UPDATE portfolios SET name = ? WHERE id = ?');
    return stmt.run(name, id);
  },
  deletePortfolio: (db, id) => {
    const stmt = db.prepare('DELETE FROM portfolios WHERE id = ?');
    return stmt.run(id);
  },

  // Holding Queries
  createHolding: (db, portfolioId, name, category) => {
    const stmt = db.prepare('INSERT INTO holdings (portfolio_id, name, category) VALUES (?, ?, ?)');
    return stmt.run(portfolioId, name, category);
  },
  getHoldingsByPortfolioId: (db, portfolioId) => {
    const stmt = db.prepare('SELECT * FROM holdings WHERE portfolio_id = ?');
    return stmt.all(portfolioId);
  },
  updateHolding: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.name) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.category) {
      updateFields.push('category = ?');
      values.push(updates.category);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE holdings SET ${updateFields.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },
  deleteHolding: (db, id) => {
    const stmt = db.prepare('DELETE FROM holdings WHERE id = ?');
    return stmt.run(id);
  },

  // Asset Queries
  createAsset: (db, holdingId, symbol, name) => {
    const stmt = db.prepare('INSERT INTO assets (holding_id, symbol, name) VALUES (?, ?, ?)');
    return stmt.run(holdingId, symbol, name);
  },
  getAssetsByHoldingId: (db, holdingId) => {
    const stmt = db.prepare('SELECT * FROM assets WHERE holding_id = ?');
    return stmt.all(holdingId);
  },
  updateAsset: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.symbol) {
      updateFields.push('symbol = ?');
      values.push(updates.symbol);
    }
    if (updates.name) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.holdingId) {
      updateFields.push('holding_id = ?');
      values.push(updates.holdingId);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE assets SET ${updateFields.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },
  deleteAsset: (db, id) => {
    const stmt = db.prepare('DELETE FROM assets WHERE id = ?');
    return stmt.run(id);
  },

  // Transaction Queries
  createTransaction: (db, portfolioId, assetId, transactionType, quantity, price) => {
    const stmt = db.prepare('INSERT INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price) VALUES (?, ?, ?, ?, ?)');
    return stmt.run(portfolioId, assetId, transactionType, quantity, price);
  },
  getTransactionsByPortfolioId: (db, portfolioId) => {
    const stmt = db.prepare('SELECT * FROM transactions WHERE portfolio_id = ?');
    return stmt.all(portfolioId);
  },
  getTransactionsByAssetId: (db, assetId) => {
    const stmt = db.prepare('SELECT * FROM transactions WHERE asset_id = ?');
    return stmt.all(assetId);
  },
  updateTransaction: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.transactionType) {
      updateFields.push('transaction_type = ?');
      values.push(updates.transactionType);
    }
    if (updates.quantity !== undefined) {
      updateFields.push('quantity = ?');
      values.push(updates.quantity);
    }
    if (updates.price !== undefined) {
      updateFields.push('price = ?');
      values.push(updates.price);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE transactions SET ${updateFields.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  },
  deleteTransaction: (db, id) => {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    return stmt.run(id);
  },

  // Asset Price Queries
  createAssetPrice: (db, assetId, price) => {
    const stmt = db.prepare('INSERT INTO asset_prices (asset_id, price) VALUES (?, ?)');
    return stmt.run(assetId, price);
  },
  getAssetPricesById: (db, assetId) => {
    const stmt = db.prepare('SELECT * FROM asset_prices WHERE asset_id = ? ORDER BY date DESC');
    return stmt.all(assetId);
  },
  getLatestAssetPrice: (db, assetId) => {
    const stmt = db.prepare('SELECT * FROM asset_prices WHERE asset_id = ? ORDER BY date DESC LIMIT 1');
    return stmt.get(assetId);
  },
  deleteAssetPrice: (db, id) => {
    const stmt = db.prepare('DELETE FROM asset_prices WHERE id = ?');
    return stmt.run(id);
  }
};
