import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 8000;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'YNARCHIVEdb'
};

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } finally {
      conn.release();
    }
  }
  return pool;
}

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const db = await getPool();
    const [result] = await db.execute(
      'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)',
      [String(name).trim(), String(email).trim(), String(message).trim()]
    );
    res.status(201).json({ id: result.insertId, ok: true });
  } catch (err) {
    console.error('Contact POST error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio API running at http://localhost:${PORT} (DB: ${dbConfig.database})`);
});
