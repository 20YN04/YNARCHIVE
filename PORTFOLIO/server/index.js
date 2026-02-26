import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '..', '.env') });

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

async function runMigrations(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const migrationsDir = join(__dirname, 'migrations');
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    const name = file.replace('.sql', '');
    const [rows] = await conn.query('SELECT 1 FROM _migrations WHERE name = ?', [name]);
    if (rows.length > 0) continue;
    const sql = await readFile(join(migrationsDir, file), 'utf8');
    const statements = sql.split(';').map((s) => s.trim()).filter(Boolean);
    for (const stmt of statements) await conn.query(stmt);
    await conn.query('INSERT INTO _migrations (name) VALUES (?)', [name]);
  }
}

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    try {
      await runMigrations(conn);
    } finally {
      conn.release();
    }
  }
  return pool;
}

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json());

app.get('/api/projects', async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.query(
      'SELECT id, title, year, category, url, image_url AS imageUrl, tags FROM projects ORDER BY year DESC, id'
    );
    const list = rows.map((r) => ({
      id: r.id,
      title: r.title,
      year: r.year,
      category: r.category,
      url: r.url ?? '',
      imageUrl: r.imageUrl,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : (r.tags || [])
    }));
    res.json(list);
  } catch (err) {
    console.error('GET /api/projects error:', err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
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
    const msg = err.message || 'Failed to save message';
    res.status(500).json({ error: msg });
  }
});

async function start() {
  await getPool();
  app.listen(PORT, () => {
    console.log(`Portfolio API running at http://localhost:${PORT} (DB: ${dbConfig.database})`);
  });
}

start().catch((err) => {
  console.error('Server start failed:', err.message);
  process.exit(1);
});
