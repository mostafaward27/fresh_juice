import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.resolve(__dirname, '../../database.sqlite');

let dbConnection: Database | null = null;

export const getDb = async (): Promise<Database> => {
  if (dbConnection) return dbConnection;
  
  dbConnection = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys, Write-Ahead Logging (WAL) mode, and busy timeout for concurrent writes
  await dbConnection.run('PRAGMA foreign_keys = ON');
  await dbConnection.run('PRAGMA journal_mode = WAL');
  await dbConnection.run('PRAGMA busy_timeout = 5000');
  
  return dbConnection;
};

export const getFreshDb = async (): Promise<Database> => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  await db.run('PRAGMA foreign_keys = ON');
  await db.run('PRAGMA journal_mode = WAL');
  await db.run('PRAGMA busy_timeout = 5000');
  return db;
};

export const initDb = async (): Promise<void> => {
  const db = await getDb();

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
