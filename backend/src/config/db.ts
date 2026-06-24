import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

const getPool = (): Pool => {
  if (pool) return pool;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is missing!');
  }
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false } // Required for hosting platforms like Supabase
  });
  return pool;
};

export interface DatabaseAdapter {
  get: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
  run: (sql: string, params?: any[]) => Promise<{ lastID?: any; changes?: number }>;
  exec: (sql: string) => Promise<void>;
  close: () => Promise<void>;
}

/**
 * Utility to convert SQLite '?' parameters to PostgreSQL '$1', '$2', etc.
 * Also maps transaction syntax.
 */
function convertSql(sql: string): string {
  // Map SQLite TRANSACTION keywords if explicit
  if (sql.trim().toUpperCase() === 'BEGIN TRANSACTION') {
    return 'BEGIN';
  }
  
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

const poolDbAdapter: DatabaseAdapter = {
  get: async (sql: string, params: any[] = []) => {
    const dbPool = getPool();
    const res = await dbPool.query(convertSql(sql), params);
    return res.rows[0];
  },
  all: async (sql: string, params: any[] = []) => {
    const dbPool = getPool();
    const res = await dbPool.query(convertSql(sql), params);
    return res.rows;
  },
  run: async (sql: string, params: any[] = []) => {
    const dbPool = getPool();
    const res = await dbPool.query(convertSql(sql), params);
    return { changes: res.rowCount || 0 };
  },
  exec: async (sql: string) => {
    const dbPool = getPool();
    await dbPool.query(convertSql(sql));
  },
  close: async () => {
    // No-op for global pool connection adapter
  }
};

export const getDb = async (): Promise<DatabaseAdapter> => {
  return poolDbAdapter;
};

export const getFreshDb = async (): Promise<DatabaseAdapter> => {
  const dbPool = getPool();
  const client = await dbPool.connect();
  
  return {
    get: async (sql: string, params: any[] = []) => {
      const res = await client.query(convertSql(sql), params);
      return res.rows[0];
    },
    all: async (sql: string, params: any[] = []) => {
      const res = await client.query(convertSql(sql), params);
      return res.rows;
    },
    run: async (sql: string, params: any[] = []) => {
      const res = await client.query(convertSql(sql), params);
      return { changes: res.rowCount || 0 };
    },
    exec: async (sql: string) => {
      await client.query(convertSql(sql));
    },
    close: async () => {
      client.release();
    }
  };
};

export const initDb = async (): Promise<void> => {
  const db = await getDb();

  // Create Users Table (mapped DATETIME -> TIMESTAMP)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      password TEXT NOT NULL,
      savedAddresses TEXT DEFAULT '[]',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Explicitly create an index on email for query speed safety
  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');

  // Create Products Table (mapped DATETIME -> TIMESTAMP)
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
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

  console.log('PostgreSQL Database tables checked and initialized.');
};
