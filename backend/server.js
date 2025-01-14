const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/init"); // SQLite database instance
const queries = require("./db/queries");

const app = express();
const PORT = 4000;
const db = initializeDatabase();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Routes
app.get("/api/hello", (req, res) => {
  console.log('Dispatching singular "Hello"');
  res.json({ message: "Your hello as been delivered. Payload: H3110. Please enjoy this hello." });
});

// User Routes
app.post("/api/createUser", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("creating user:",username,email,password)
    const checkUser = queries.getUserByEmail(db, email)
    if(checkUser){
      console.log("error: user exists")
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = queries.createUser(db, username, email, password)

    if (newUser?.lastInsertRowid){
      console.log("creating default portfolio")
      var portfolio = queries.getOrCreatePortfolio(db, newUser?.lastInsertRowid);
      console.log("portfolio created:",portfolio)
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in createUser:", error);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
});

app.post("/api/loginUser", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = queries.getUserByEmailPassword(db, email, password);
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in loginUser:", error);
    res
      .status(500)
      .json({ error: "Failed to login user", details: error.message });
  }
});

app.get("/api/getUserById", async (req, res) => {
  try {
    console.log('query',req.query)
    const { id } = req.query;
    const user = queries.getUserById(db, id);
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user", details: error.message });
  }
});

app.get("/api/getUserByEmail", async (req, res) => {
  try {
    const { email } = req.query;
    const user = queries.getUserByEmail(db, email)
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user", details: error.message });
  }
});

app.post("/api/updateUser", async (req, res) => {
  try {
    const { id, updates } = req.body;
    const updatedUser = queries.updateUser(db, id, updates);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error);
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
});

app.delete("/api/deleteUser", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedUser = queries.deleteUser(db, id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res
      .status(500)
      .json({ error: "Failed to delete user", details: error.message });
  }
});

// Portfolio Routes
app.post("/api/createPortfolio", async (req, res) => {
  try {
    const { userId, name } = req.body;
    const newPortfolio = queries.createPortfolio(db, userId, name);
    res.status(201).json(newPortfolio);
  } catch (error) {
    console.error("Error in createPortfolio:", error);
    res
      .status(500)
      .json({ error: "Failed to create portfolio", details: error.message });
  }
});

app.get("/api/getPortfoliosByUserId", async (req, res) => {
  try {
    const { userId } = req.query;

    let portfolios = queries.getOrCreatePortfolio(db, userId);
    console.log("users portfolios:", portfolios);
    res.json(portfolios);
  } catch (error) {
    console.error("Error in getPortfoliosByUserId:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch portfolios", details: error.message });
  }
});

app.post("/api/updatePortfolioName", async (req, res) => {
  try {
    const { id, name } = req.body;
    const updatedPortfolio = queries.updatePortfolioName(db, id, name)
    if (!updatedPortfolio)
      return res.status(404).json({ error: "Portfolio not found" });
    res.json(updatedPortfolio);
  } catch (error) {
    console.error("Error in updatePortfolioName:", error);
    res
      .status(500)
      .json({ error: "Failed to update portfolio", details: error.message });
  }
});

app.delete("/api/deletePortfolio", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedPortfolio = queries.deletePortfolio(db, id);
    if (!deletedPortfolio)
      return res.status(404).json({ error: "Portfolio not found" });
    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("Error in deletePortfolio:", error);
    res
      .status(500)
      .json({ error: "Failed to delete portfolio", details: error.message });
  }
});

// Holding Routes
app.post("/api/createHolding", async (req, res) => {
  try {
    const { portfolioId, name, category } = req.body;
    const newHolding = queries.createHolding(db, portfolioId, name, category);
    res.status(201).json(newHolding);
  } catch (error) {
    console.error("Error in createHolding:", error);
    res
      .status(500)
      .json({ error: "Failed to create holding", details: error.message });
  }
});

app.get("/api/getHoldingsByPortfolioId", async (req, res) => {
  try {
    const { portfolioId } = req.query;
    //const holdings = queries.getHoldingsByPortfolioId(db, portfolioId);
    const holdings = queries.getHoldingsWithRecentHistoryByPortfolioId(db, portfolioId);
    console.log(`Got holdings of length: ${holdings.length} for portfolioId: ${portfolioId}`);
    res.json(holdings);
  } catch (error) {
    console.error("Error in getHoldingsByPortfolioId:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch holdings", details: error.message });
  }
});

app.post("/api/updateHolding", async (req, res) => {
  try {
    const { id, updates } = req.body;
    const updatedHolding = queries.updateHolding(db, id, updates);
    if (!updatedHolding)
      return res.status(404).json({ error: "Holding not found" });
    res.json(updatedHolding);
  } catch (error) {
    console.error("Error in updateHolding:", error);
    res
      .status(500)
      .json({ error: "Failed to update holding", details: error.message });
  }
});

app.delete("/api/deleteHolding", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedHolding = queries.deleteHolding(db, id);
    if (!deletedHolding)
      return res.status(404).json({ error: "Holding not found" });
    res.json({ message: "Holding deleted successfully" });
  } catch (error) {
    console.error("Error in deleteHolding:", error);
    res
      .status(500)
      .json({ error: "Failed to delete holding", details: error.message });
  }
});

// Asset Routes
app.post("/api/createAsset", async (req, res) => {
  try {
    const { holdingId, symbol, name } = req.body;
    const newAsset = queries.createAsset(db, holdingId, symbol, name);
    res.status(201).json(newAsset);
  } catch (error) {
    console.error("Error in createAsset:", error);
    res
      .status(500)
      .json({ error: "Failed to create asset", details: error.message });
  }
});

app.get("/api/getAssetsByHoldingId", async (req, res) => {
  try {
    const { holdingId } = req.query;
    const assets = queries.getAssetsByHoldingId(db, holdingId);
    res.json(assets);
  } catch (error) {
    console.error("Error in getAssetsByHoldingId:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch assets", details: error.message });
  }
});

app.post("/api/updateAsset", async (req, res) => {
  try {
    const { id, updates } = req.body;
    const updatedAsset = queries.updateAsset(db, id, updates);
    if (!updatedAsset)
      return res.status(404).json({ error: "Asset not found" });
    res.json(updatedAsset);
  } catch (error) {
    console.error("Error in updateAsset:", error);
    res
      .status(500)
      .json({ error: "Failed to update asset", details: error.message });
  }
});

app.delete("/api/deleteAsset", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedAsset = queries.deleteAsset(db, id);
    if (!deletedAsset)
      return res.status(404).json({ error: "Asset not found" });
    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAsset:", error);
    res
      .status(500)
      .json({ error: "Failed to delete asset", details: error.message });
  }
});

// Transaction Routes
app.post("/api/createTransaction", async (req, res) => {
  try {
    const { portfolioId, assetId, transactionType, quantity, price } = req.body;
    const newTransaction = queries.createTransaction(db, portfolioId, assetId, transactionType, quantity, price);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error in createTransaction:", error);
    res
      .status(500)
      .json({ error: "Failed to create transaction", details: error.message });
  }
});

app.get("/api/getTransactionsByPortfolioId", async (req, res) => {
  try {
    const { portfolioId } = req.query;
    const transactions = queries.getTransactionsByPortfolioId(db, portfolioId);
    res.json(transactions);
  } catch (error) {
    console.error("Error in getTransactionsByPortfolioId:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch transactions", details: error.message });
  }
});

app.get("/api/getTransactionsByAssetId", async (req, res) => {
  try {
    const { assetId } = req.query;
    const transactions = queries.getTransactionsByAssetId(db, assetId);
    res.json(transactions);
  } catch (error) {
    console.error("Error in getTransactionsByAssetId:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch transactions", details: error.message });
  }
});

app.post("/api/updateTransaction", async (req, res) => {
  try {
    const { id, updates } = req.body;
    const updatedTransaction = queries.updateTransaction(db, id, updates);
    if (!updatedTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(updatedTransaction);
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    res
      .status(500)
      .json({ error: "Failed to update transaction", details: error.message });
  }
});

app.delete("/api/deleteTransaction", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedTransaction = queries.deleteTransaction(db, id);
    if (!deletedTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    res
      .status(500)
      .json({ error: "Failed to delete transaction", details: error.message });
  }
});

// Asset Price Routes
app.post("/api/createAssetPrice", async (req, res) => {
  try {
    const { assetId, price } = req.body;
    const newAssetPrice = queries.createAssetPrice(db, assetId, price);
    res.status(201).json(newAssetPrice);
  } catch (error) {
    console.error("Error in createAssetPrice:", error);
    res
      .status(500)
      .json({ error: "Failed to create asset price", details: error.message });
  }
});

app.get("/api/getAssetPricesById", async (req, res) => {
  try {
    const { assetId } = req.query;
    const assetPrices = queries.getAssetPricesById(db, assetId).sort({
      createdAt: -1,
    });
    res.json(assetPrices);
  } catch (error) {
    console.error("Error in getAssetPricesById:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch asset prices", details: error.message });
  }
});

app.get("/api/getLatestAssetPrice", async (req, res) => {
  try {
    const { assetId } = req.query;
    const latestPrice = queries.getLatestAssetPrice(db, assetId).sort({
      createdAt: -1,
    });
    if (!latestPrice)
      return res.status(404).json({ error: "No price found for this asset" });
    res.json(latestPrice);
  } catch (error) {
    console.error("Error in getLatestAssetPrice:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch latest asset price",
        details: error.message,
      });
  }
});

app.delete("/api/deleteAssetPrice", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedAssetPrice = queries.deleteAssetPrice(db, id);
    if (!deletedAssetPrice)
      return res.status(404).json({ error: "Asset price not found" });
    res.json({ message: "Asset price deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAssetPrice:", error);
    res
      .status(500)
      .json({ error: "Failed to delete asset price", details: error.message });
  }
});

// Create a new portfolio history record
app.post('/api/portfolioHistory', async (req, res) => {
  try {
    const { portfolioId, date, total, netSpent, profit } = req.body;
    const result = queries.createPortfolioHistory(db, portfolioId, date, total, netSpent, profit);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in createPortfolioHistory:', error);
    res.status(500).json({ error: 'Failed to create portfolio history', details: error.message });
  }
});

// Get all portfolio history records for a specific portfolio
app.get('/api/portfolioHistory/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const history = queries.getPortfolioHistoryById(db, portfolioId);
    console.log(`Got history of length: ${history.length} for portfolioId: ${portfolioId}`);
    res.json(history);
  } catch (error) {
    console.error('Error in getPortfolioHistoryById:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio history', details: error.message });
  }
});

// Get a specific portfolio history record by portfolio ID and date
app.get('/api/portfolioHistory/:portfolioId/:date', async (req, res) => {
  try {
    const { portfolioId, date } = req.params;
    const history = queries.getPortfolioHistoryByDate(db, portfolioId, date);
    if (!history) return res.status(404).json({ error: 'Portfolio history not found' });
    res.json(history);
  } catch (error) {
    console.error('Error in getPortfolioHistoryByDate:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio history', details: error.message });
  }
});

// Update a portfolio history record
app.put('/api/portfolioHistory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = queries.updatePortfolioHistory(db, id, updates);
    res.json(result);
  } catch (error) {
    console.error('Error in updatePortfolioHistory:', error);
    res.status(500).json({ error: 'Failed to update portfolio history', details: error.message });
  }
});

// Delete a single portfolio history record
app.delete('/api/portfolioHistory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = queries.deleteSinglePortfolioHistory(db, id);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteSinglePortfolioHistory:', error);
    res.status(500).json({ error: 'Failed to delete portfolio history', details: error.message });
  }
});

// Clear all portfolio history records for a specific portfolio
app.delete('/api/portfolioHistory/clear/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const result = queries.clearPortfolioHistory(db, portfolioId);
    res.json(result);
  } catch (error) {
    console.error('Error in clearPortfolioHistory:', error);
    res.status(500).json({ error: 'Failed to clear portfolio history', details: error.message });
  }
});

// Create a new holdings history record
app.post('/api/holdingsHistory', async (req, res) => {
  try {
    const { holdingsId, date, total, netSpent, profit } = req.body;
    const result = queries.insertHoldingsHistory(db, holdingsId, date, total, netSpent, profit);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in createHoldingsHistory:', error);
    res.status(500).json({ error: 'Failed to create holdings history', details: error.message });
  }
});

// Get all holdings history records for a specific holding
app.get('/api/holdingsHistory/:holdingsId', async (req, res) => {
  try {
    const { holdingsId } = req.params;
    const history = queries.getHoldingsHistoryById(db, holdingsId);
    console.log(`Got history of length: ${history.length} for holdingsId: ${holdingsId}`);
    res.json(history);
  } catch (error) {
    console.error('Error in getHoldingsHistoryById:', error);
    res.status(500).json({ error: 'Failed to fetch holdings history', details: error.message });
  }
});

// Get a specific holdings history record by holdings ID and date
app.get('/api/holdingsHistory/:holdingsId/:date', async (req, res) => {
  try {
    const { holdingsId, date } = req.params;
    const history = queries.getHoldingsHistoryByDate(db, holdingsId, date);
    if (!history) return res.status(404).json({ error: 'Holdings history not found' });
    res.json(history);
  } catch (error) {
    console.error('Error in getHoldingsHistoryByDate:', error);
    res.status(500).json({ error: 'Failed to fetch holdings history', details: error.message });
  }
});

// Update a holdings history record
app.put('/api/holdingsHistory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = queries.updateHoldingsHistory(db, id, updates);
    res.json(result);
  } catch (error) {
    console.error('Error in updateHoldingsHistory:', error);
    res.status(500).json({ error: 'Failed to update holdings history', details: error.message });
  }
});

// Delete a single holdings history record
app.delete('/api/holdingsHistory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = queries.deleteSingleHoldingsHistory(db, id);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteSingleHoldingsHistory:', error);
    res.status(500).json({ error: 'Failed to delete holdings history', details: error.message });
  }
});

// Clear all holdings history records for a specific holding
app.delete('/api/holdingsHistory/clear/:holdingsId', async (req, res) => {
  try {
    const { holdingsId } = req.params;
    const result = queries.clearHoldingsHistory(db, holdingsId);
    res.json(result);
  } catch (error) {
    console.error('Error in clearHoldingsHistory:', error);
    res.status(500).json({ error: 'Failed to clear holdings history', details: error.message });
  }
});