import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool with improved configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 10, // Reduced maximum number of clients in the pool
  min: 2, // Minimum number of clients to maintain
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Increased timeout to 10 seconds
  acquireTimeoutMillis: 10000, // Time to wait for a client from the pool
  createTimeoutMillis: 10000, // Time to wait for a new connection
  destroyTimeoutMillis: 5000, // Time to wait for a connection to close
  reapIntervalMillis: 1000, // How often to check for idle connections
  createRetryIntervalMillis: 200, // How long to wait before retrying connection creation
  maxUses: 7500, // Maximum number of times a connection can be used
  allowExitOnIdle: false, // Don't exit process when pool is idle
});

// Test database connection with retry mechanism
export const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('Database connected successfully at:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('All database connection attempts failed');
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

// Get a client from the pool
export const getClient = () => {
  return pool.connect();
};

// Execute a query with retry mechanism
export const query = async (text, params, retries = 2) => {
  const start = Date.now();
  
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`Query executed in ${duration}ms`);
      return res;
    } catch (error) {
      console.error(`Query attempt ${i + 1} failed:`, error.message);
      
      // Check if it's a connection error
      if (error.message.includes('Connection terminated') || 
          error.message.includes('timeout') ||
          error.message.includes('ECONNRESET')) {
        
        if (i === retries - 1) {
          console.error('All query attempts failed');
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      // For non-connection errors, don't retry
      throw error;
    }
  }
};

// Close the pool
export const closePool = async () => {
  await pool.end();
};

export { pool };
