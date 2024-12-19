-- schema.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS portfolio_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL,
    net_spent REAL NOT NULL,
    profit REAL NOT NULL,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
);

CREATE TABLE IF NOT EXISTS holdings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
);

CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    holding_id INTEGER NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (holding_id) REFERENCES holdings (id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL,
    quantity REAL NOT NULL,
    price REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
    FOREIGN KEY (asset_id) REFERENCES assets (id)
);

CREATE TABLE IF NOT EXISTS asset_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER NOT NULL,
    price REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets (id)
);
