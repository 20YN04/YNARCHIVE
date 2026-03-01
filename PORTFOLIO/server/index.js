import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_PATH = join(__dirname, 'data', 'projects.json');

const app = express();
const PORT = process.env.PORT || 8000;

let projectsCache = null;

async function getProjects() {
  if (projectsCache) return projectsCache;
  const raw = await readFile(PROJECTS_PATH, 'utf8');
  projectsCache = JSON.parse(raw);
  return projectsCache;
}

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json());

app.get('/api/projects', async (req, res) => {
  try {
    const list = await getProjects();
    const sorted = [...list].sort((a, b) => (b.year - a.year) || 0);
    res.json(sorted);
  } catch (err) {
    console.error('GET /api/projects error:', err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  console.log('Contact submission:', { name: name.trim(), email: email.trim(), message: message.trim().slice(0, 100) + (message.length > 100 ? '…' : '') });
  res.status(201).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Portfolio API running at http://localhost:${PORT} (no database)`);
});
