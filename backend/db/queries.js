module.exports = {
  // User Queries
  createUser: (db, username, email, password) => {
    console.log("creating user: ", username);
    const stmt = db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    );
    const result = stmt.run(username, email, password);
    console.log("user creation result:", result);
    return result;
  },

  getUserByEmailPassword: (db, email, password) => {
    console.log("Logging in User:", email);
    const stmt = db.prepare(
      "SELECT * FROM users WHERE email = ? AND password = ?"
    );
    const result = stmt.get(email, password); // Ensure ID is numeric
    if (!result) {
      console.log("No user found with this email/pw.");
    }
    return result;
  },
  getUserById: (db, id) => {
    console.log("Looking for user with ID:", id);
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const result = stmt.get(Number(id)); // Ensure ID is numeric
    if (!result) {
      console.log("No user found with the given ID.");
    }
    return result;
  },
  getUserByEmail: (db, email) => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },
  updateUser: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.username) {
      updateFields.push("username = ?");
      values.push(updates.username);
    }
    if (updates.email) {
      updateFields.push("email = ?");
      values.push(updates.email);
    }
    if (updates.password) {
      updateFields.push("password = ?");
      values.push(updates.password);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`
    );
    return stmt.run(...values);
  },
  deleteUser: (db, id) => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    return stmt.run(id);
  },

  // Portfolio Queries
  getOrCreatePortfolio: (db, userId) => {
    const checkStmt = db.prepare("SELECT * FROM portfolios WHERE user_id = ?");
    const portfolios = checkStmt.all(userId);

    if (portfolios?.length) {
      console.log("user has portfolios of length:", portfolios.length);
      return portfolios;
    }
    console.log("user has no portfolios, creating...");
    const createStmt = db.prepare(
      "INSERT INTO portfolios (user_id, name) VALUES (?, ?)"
    );
    createStmt.run(userId, "Portfolio 1");

    // Fetch and return the newly created portfolio
    return checkStmt.all(userId);
  },
  createPortfolio: (db, userId, name) => {
    const stmt = db.prepare(
      "INSERT INTO portfolios (user_id, name) VALUES (?, ?)"
    );
    return stmt.run(userId, name);
  },
  getPortfoliosByUserId: (db, userId) => {
    const stmt = db.prepare("SELECT * FROM portfolios WHERE user_id = ?");
    return stmt.all(userId);
  },
  updatePortfolioName: (db, id, name) => {
    const stmt = db.prepare("UPDATE portfolios SET name = ? WHERE id = ?");
    return stmt.run(name, id);
  },
  deletePortfolio: (db, id) => {
    const stmt = db.prepare("DELETE FROM portfolios WHERE id = ?");
    return stmt.run(id);
  },

  // Holding Queries
  createHolding: (db, portfolioId, name, category) => {
    const stmt = db.prepare(
      "INSERT INTO holdings (portfolio_id, name, category) VALUES (?, ?, ?)"
    );
    return stmt.run(portfolioId, name, category);
  },
  getHoldingsByPortfolioId: (db, portfolioId) => {
    const stmt = db.prepare("SELECT * FROM holdings WHERE portfolio_id = ?");
    return stmt.all(portfolioId);
  },
  updateHolding: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.name) {
      updateFields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.category) {
      updateFields.push("category = ?");
      values.push(updates.category);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE holdings SET ${updateFields.join(", ")} WHERE id = ?`
    );
    return stmt.run(...values);
  },
  deleteHolding: (db, id) => {
    const stmt = db.prepare("DELETE FROM holdings WHERE id = ?");
    return stmt.run(id);
  },

  // Holdings History Queries
  insertHoldingsHistory: (db, holdingsId, date, total, netSpent, profit) => {
    const stmt = db.prepare(
      "INSERT INTO holdings_history (holdings_id, date, total, net_spent, profit) VALUES (?, ?, ?, ?, ?)"
    );
    return stmt.run(holdingsId, date, total, netSpent, profit);
  },
  getHoldingsHistoryById: (db, holdingsId) => {
    const stmt = db.prepare(
      "SELECT * FROM holdings_history WHERE holdings_id = ? ORDER BY date DESC"
    );
    return stmt.all(holdingsId);
  },
  getHoldingsHistoryByDate: (db, holdingsId, date) => {
    const stmt = db.prepare(
      "SELECT * FROM holdings_history WHERE holdings_id = ? AND date = ?"
    );
    return stmt.get(holdingsId, date);
  },
  updateHoldingsHistory: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.total !== undefined) {
      updateFields.push("total = ?");
      values.push(updates.total);
    }
    if (updates.netSpent !== undefined) {
      updateFields.push("net_spent = ?");
      values.push(updates.netSpent);
    }
    if (updates.profit !== undefined) {
      updateFields.push("profit = ?");
      values.push(updates.profit);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE holdings_history SET ${updateFields.join(", ")} WHERE id = ?`
    );
    return stmt.run(...values);
  },
  deleteSingleHoldingsHistory: (db, id) => {
    const stmt = db.prepare("DELETE FROM holdings_history WHERE id = ?");
    return stmt.run(id);
  },
  clearHoldingsHistory: (db, holdingsId) => {
    const stmt = db.prepare(
      "DELETE FROM holdings_history WHERE holdings_id = ?"
    );
    return stmt.run(holdingsId);
  },

  // Asset Queries
  createAsset: (db, holdingId, symbol, name) => {
    const stmt = db.prepare(
      "INSERT INTO assets (holding_id, symbol, name) VALUES (?, ?, ?)"
    );
    return stmt.run(holdingId, symbol, name);
  },
  getAssetsByHoldingId: (db, holdingId) => {
    const stmt = db.prepare("SELECT * FROM assets WHERE holding_id = ?");
    return stmt.all(holdingId);
  },
  updateAsset: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.symbol) {
      updateFields.push("symbol = ?");
      values.push(updates.symbol);
    }
    if (updates.name) {
      updateFields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.holdingId) {
      updateFields.push("holding_id = ?");
      values.push(updates.holdingId);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE assets SET ${updateFields.join(", ")} WHERE id = ?`
    );
    return stmt.run(...values);
  },
  deleteAsset: (db, id) => {
    const stmt = db.prepare("DELETE FROM assets WHERE id = ?");
    return stmt.run(id);
  },

  // Transaction Queries
  createTransaction: (
    db,
    portfolioId,
    assetId,
    transactionType,
    quantity,
    price
  ) => {
    const stmt = db.prepare(
      "INSERT INTO transactions (portfolio_id, asset_id, transaction_type, quantity, price) VALUES (?, ?, ?, ?, ?)"
    );
    return stmt.run(portfolioId, assetId, transactionType, quantity, price);
  },
  getTransactionsByPortfolioId: (db, portfolioId) => {
    const stmt = db.prepare(
      "SELECT * FROM transactions WHERE portfolio_id = ?"
    );
    return stmt.all(portfolioId);
  },
  getTransactionsByAssetId: (db, assetId) => {
    const stmt = db.prepare("SELECT * FROM transactions WHERE asset_id = ?");
    return stmt.all(assetId);
  },
  updateTransaction: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.transactionType) {
      updateFields.push("transaction_type = ?");
      values.push(updates.transactionType);
    }
    if (updates.quantity !== undefined) {
      updateFields.push("quantity = ?");
      values.push(updates.quantity);
    }
    if (updates.price !== undefined) {
      updateFields.push("price = ?");
      values.push(updates.price);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE transactions SET ${updateFields.join(", ")} WHERE id = ?`
    );
    return stmt.run(...values);
  },
  deleteTransaction: (db, id) => {
    const stmt = db.prepare("DELETE FROM transactions WHERE id = ?");
    return stmt.run(id);
  },

  // Asset Price Queries
  createAssetPrice: (db, assetId, price) => {
    const stmt = db.prepare(
      "INSERT INTO asset_prices (asset_id, price) VALUES (?, ?)"
    );
    return stmt.run(assetId, price);
  },
  getAssetPricesById: (db, assetId) => {
    const stmt = db.prepare(
      "SELECT * FROM asset_prices WHERE asset_id = ? ORDER BY date DESC"
    );
    return stmt.all(assetId);
  },
  getLatestAssetPrice: (db, assetId) => {
    const stmt = db.prepare(
      "SELECT * FROM asset_prices WHERE asset_id = ? ORDER BY date DESC LIMIT 1"
    );
    return stmt.get(assetId);
  },
  deleteAssetPrice: (db, id) => {
    const stmt = db.prepare("DELETE FROM asset_prices WHERE id = ?");
    return stmt.run(id);
  },

  // Portfolio History Queries
  insertPortfolioHistory: (db, portfolioId, date, total, netSpent, profit) => {
    const stmt = db.prepare(
      "INSERT INTO portfolio_history (portfolio_id, date, total, net_spent, profit) VALUES (?, ?, ?, ?, ?)"
    );
    return stmt.run(portfolioId, date, total, netSpent, profit);
  },
  getPortfolioHistoryById: (db, portfolioId) => {
    const stmt = db.prepare(
      "SELECT * FROM portfolio_history WHERE portfolio_id = ? ORDER BY date DESC"
    );
    return stmt.all(portfolioId);
  },
  getPortfolioHistoryByDate: (db, portfolioId, date) => {
    const stmt = db.prepare(
      "SELECT * FROM portfolio_history WHERE portfolio_id = ? AND date = ?"
    );
    return stmt.get(portfolioId, date);
  },
  updatePortfolioHistory: (db, id, updates) => {
    const updateFields = [];
    const values = [];

    if (updates.total !== undefined) {
      updateFields.push("total = ?");
      values.push(updates.total);
    }
    if (updates.netSpent !== undefined) {
      updateFields.push("net_spent = ?");
      values.push(updates.netSpent);
    }
    if (updates.profit !== undefined) {
      updateFields.push("profit = ?");
      values.push(updates.profit);
    }

    values.push(id);
    const stmt = db.prepare(
      `UPDATE portfolio_history SET ${updateFields.join(", ")} WHERE id = ?`
    );
    return stmt.run(...values);
  },
  deleteSinglePortfolioHistory: (db, id) => {
    const stmt = db.prepare("DELETE FROM portfolio_history WHERE id = ?");
    return stmt.run(id);
  },
  clearPortfolioHistory: (db, portfolioId) => {
    const stmt = db.prepare(
      "DELETE FROM portfolio_history WHERE portfolio_id = ?"
    );
    return stmt.run(portfolioId);
  },
};
