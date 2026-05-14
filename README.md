# Point Window v2 (Refactored)

Full-stack refactor of the single-file `PointWindow_Modern.jsx` into a scalable `client + server` structure.

## Run locally

1. `npm install`
2. Copy env files:
- `client/.env.example` to `client/.env`
- `server/.env.example` to `server/.env`
3. `npm run dev`

Client runs on `http://localhost:5173`.
Server runs on `http://localhost:5000`.

## Security model

- Frontend never calls AI providers directly.
- AI endpoints are backend-only (`/api/ai/*`).
- API keys exist only in `server/.env`.
- CORS is env-driven.
- AI endpoints include rate limiting.
- Request payloads are size-limited.
- User notes and saved links are sanitized server-side.

## Notes

- Current backend uses dev in-memory stores and mock fallback data for local development.
- `localStorage` remains as temporary fallback in client services when backend is unavailable.
- TODO markers indicate where to wire production DB, auth, and provider SDKs.

## Legal scope

This project is a tracker + AI companion only. It does not implement chapter/image reading, scraping piracy sites, or hosting copyrighted manga/manhwa content.

## Deployment

### Backend on Render

- Service type: `Web Service`
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

- `NODE_ENV=production`
- `PORT=5000` (Render may override this automatically)
- `CLIENT_ORIGIN=https://your-frontend-domain.com`
- `ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173`
- `AI_API_KEY=your_server_side_key`

Health checks:

- `GET /` -> `{ "success": true, "message": "Point Window API" }`
- `GET /api/health` -> `{ "success": true, "message": "Point Window API is running", "timestamp": "..." }`

### Frontend on Hostinger (static)

1. Create `client/.env.production`:

`VITE_API_BASE_URL=https://your-render-service.onrender.com/api`

2. Build:

`npm run build -w client`

3. Upload the contents of `client/dist` to Hostinger `public_html` (or a subfolder).
