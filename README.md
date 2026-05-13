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
