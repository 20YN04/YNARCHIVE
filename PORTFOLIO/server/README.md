# Portfolio API

Express server for the portfolio frontend. No database: projects are loaded from static JSON; contact form submissions are validated and logged to the console.

- **GET** `/api/projects` — returns projects from `data/projects.json` (edit that file to change the list)
- **POST** `/api/contact` — body: `{ name, email, message }` → validated, then returns 201 (submissions are logged to the server console only)

## Run

```bash
cd server
npm install
npm start     # http://localhost:8000
```

Development with auto-restart: `npm run dev`

The Angular app (port 4200) uses `http://localhost:8000/api` for projects and contact.
