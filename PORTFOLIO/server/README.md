# Portfolio API (Contact form backend)

Express server met **MySQL** (database: `YNARCHIVEdb`). Slaat contactformulier-submissions op.

- **POST** `/api/contact` — body: `{ name, email, message }` → opgeslagen in MySQL

## Database & migraties

- Database: **YNARCHIVEdb** (bestaande MySQL-db)
- Tabellen worden aangemaakt via **migraties** (bij serverstart of handmatig).

**Handmatig migraties draaien:**
```bash
npm run migrate
```

**Tabellen:**
- `_migrations` — welke migraties al gedraaid zijn
- `contact_submissions` — contactformulier (name, email, message, created_at)
- `projects` — portfolio-work (id, title, year, category, url, image_url, tags JSON, created_at, updated_at). Geen seed; vul zelf aan.

## Configuratie

Kopieer `.env.example` naar `.env` en vul je MySQL-gegevens in:

```bash
cp .env.example .env
```

In `.env` (zelfde namen als Laravel):
- `DB_HOST`, `DB_PORT`, `DB_DATABASE=YNARCHIVEdb`, `DB_USERNAME`, `DB_PASSWORD`

## Run

```bash
cd server
npm install
npm start     # http://localhost:8000
```

Development met auto-restart: `npm run dev`

Start de Angular-app met `ng serve` (port 4200). Het contactformulier post naar `http://localhost:8000/api/contact` zodra de API draait.
