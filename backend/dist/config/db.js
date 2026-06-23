"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.getDb = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbPath = path_1.default.resolve(__dirname, '../../database.sqlite');
let dbConnection = null;
const getDb = async () => {
    if (dbConnection)
        return dbConnection;
    dbConnection = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database
    });
    // Enable foreign keys
    await dbConnection.run('PRAGMA foreign_keys = ON');
    return dbConnection;
};
exports.getDb = getDb;
const initDb = async () => {
    const db = await (0, exports.getDb)();
    // Create Users Table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      password TEXT NOT NULL,
      savedAddresses TEXT DEFAULT '[]',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Create Products Table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      rating REAL DEFAULT 5.0,
      reviewsCount INTEGER DEFAULT 1,
      isFeatured INTEGER DEFAULT 0,
      isSpecial INTEGER DEFAULT 0,
      availableSizes TEXT DEFAULT '[]',
      availableSugar TEXT DEFAULT '[]',
      availableIce TEXT DEFAULT '[]',
      availableExtras TEXT DEFAULT '[]',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Create Orders Table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      totalPrice REAL NOT NULL,
      deliveryFee REAL DEFAULT 10,
      status TEXT DEFAULT 'received',
      paymentMethod TEXT DEFAULT 'cod',
      createdAt TEXT NOT NULL,
      estimatedDelivery TEXT DEFAULT '30-40 دقيقة',
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
    // Create Order Items Table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      productId TEXT NOT NULL,
      name TEXT NOT NULL,
      image TEXT,
      quantity INTEGER NOT NULL,
      selectedSize TEXT NOT NULL,
      selectedSugar INTEGER NOT NULL,
      selectedIce TEXT NOT NULL,
      selectedExtras TEXT DEFAULT '[]',
      customizedPrice REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
    console.log('SQLite Database tables checked and initialized.');
};
exports.initDb = initDb;
