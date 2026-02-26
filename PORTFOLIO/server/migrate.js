import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
dotenv.config({ path: join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE || 'YNARCHIVEdb'
};

async function run() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
  } catch (err) {
    console.error('Migratie mislukt:', err.message);
    console.error('');
    console.error('Controleer:');
    console.error('  1. MySQL draait (bijv. MAMP/XAMPP of mysql service)');
    console.error('  2. Bestand server/.env bestaat met: DB_DATABASE, DB_USERNAME, DB_PASSWORD');
    console.error('  3. Gebruiker heeft rechten op database YNARCHIVEdb');
    process.exit(1);
  }
  try {
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
      if (rows.length > 0) {
        console.log('Skip (al uitgevoerd):', name);
        continue;
      }
      const sql = await readFile(join(migrationsDir, file), 'utf8');
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of statements) {
        await conn.query(stmt);
      }
      await conn.query('INSERT INTO _migrations (name) VALUES (?)', [name]);
      console.log('OK:', name);
    }
    console.log('Migraties klaar.');
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Migratie mislukt:', err.message);
  if (err.message && err.message.includes('Access denied')) {
    console.error('');
    console.error('Controleer server/.env: DB_USERNAME en DB_PASSWORD moeten kloppen.');
  }
  process.exit(1);
});
