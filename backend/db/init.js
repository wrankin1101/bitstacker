const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const queries = require("./queries");

const dbPath = path.resolve(__dirname, "database.sqlite");
const schemaPath = path.resolve(__dirname, "schema.sql");
const dataPath = path.resolve(__dirname, "portfoliohistory.json"); // Path to your JSON file

// Function to initialize the database
function initializeDatabase(options = {}) {
  const { reset = false } = options;

  // If reset is true, delete the existing database file
  if (reset && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log("Existing database file deleted.");
  }

  // Create or connect to the database
  const db = new Database(dbPath);

  // Load and execute schema
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);

  console.log("Database initialized with schema.");

  let portfolioId = 1; // Replace with the actual portfolio ID

  // Create default user for development
  const userExists = db.prepare(`SELECT 1 FROM users LIMIT 1`).get();
  if (!userExists) {
    const result = queries.createUser(
      db,
      "default_user",
      "default@example.com",
      "default1234"
    );
    console.log("Default user created for development.");
    if (result?.lastInsertRowid) {
      console.log("creating default portfolio");
      var portfolios = queries.getOrCreatePortfolio(db, result?.lastInsertRowid);
      console.log("portfolio created:", portfolios);
      portfolioId = portfolios[0].id;
    }
  }

  //initialize the portfolio history table from the JSON file
  if (reset) {
    // Read and parse the JSON data
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(jsonData);

    // Find the objects where title is "Total", "Net Spent", and "Profit"
    const totalData = data.find((item) => item.title === "Total").values;
    const netSpentData = data.find((item) => item.title === "Net Spent").values;
    const profitData = data.find((item) => item.title === "Profit").values;

    // Combine data based on date
    const combinedData = {};

    const initialData = {
      totalSum: 0,
      totalCount: 0,
      netSpentSum: 0,
      netSpentCount: 0,
      profitSum: 0,
      profitCount: 0,
    }

    totalData.forEach((item) => {
      if (item.value === 0) {
        return;
      }
      if (!combinedData[item.date]) {
        combinedData[item.date] = { ...initialData };
      }
      combinedData[item.date].totalSum += item.value;
      combinedData[item.date].totalCount += 1;
    });

    netSpentData.forEach((item) => {
      if (item.value === 0) {
        return;
      }
      if (!combinedData[item.date]) {
        combinedData[item.date] = { ...initialData };
      }
      combinedData[item.date].netSpentSum += item.value;
      combinedData[item.date].netSpentCount += 1;
    });

    profitData.forEach((item) => {
      if (item.value === 0) {
        return;
      }
      if (!combinedData[item.date]) {
        combinedData[item.date] = { ...initialData };
      }
      combinedData[item.date].profitSum += item.value;
      combinedData[item.date].profitCount += 1;
    });

    // Generate and execute SQL INSERT statements
    const insertStmt = db.prepare(
      `INSERT INTO portfolio_history (portfolio_id, date, total, net_spent, profit) VALUES (?, ?, ?, ?, ?)`
    );

    db.transaction(() => {
      for (const [date, values] of Object.entries(combinedData)) {
        const total = values.totalSum / values.totalCount;
        const netSpent = values.netSpentSum / values.netSpentCount;
        const profit = values.profitSum / values.profitCount;
        insertStmt.run(portfolioId, date, total, netSpent, profit);
      }
    })();

    console.log("Data from json inserted into portfolio_history table.");
  }

  return db;
}

// Check if this script is being run directly
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case "init":
      initializeDatabase();
      break;
    case "reset":
      initializeDatabase({ reset: true });
      break;
    default:
      console.log("Usage: node db/init.js [init|reset]");
      process.exit(1);
  }
}

module.exports = {
  initializeDatabase,
};
