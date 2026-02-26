# Portfolio API (Contact form backend)

Express server met **MySQL** (database: `YNARCHIVEdb`). Slaat contactformulier-submissions op.

- **POST** `/api/contact` — body: `{ name, email, message }` → opgeslagen in MySQL

## Database

- Database: **YNARCHIVEdb** (bestaande MySQL-db)
- Tabel: `contact_submissions` (wordt automatisch aangemaakt als die nog niet bestaat)
  - `id` INT AUTO_INCREMENT PRIMARY KEY
  - `name` VARCHAR(255)
  - `email` VARCHAR(255)
  - `message` TEXT
  - `created_at` DATETIME

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
