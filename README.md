# MERN + OAuth Image Search (ready-to-run)

This repository contains a full-stack MERN application with OAuth (Google, GitHub, Facebook) via Passport.js and Unsplash integration for image search. The project uses Vite for the frontend (React + TailwindCSS) and Express/Mongoose for the backend.

## What's included

- OAuth login (Google, GitHub, Facebook)
- Protected search and history routes (only available to logged-in users)
- Unsplash API integration (search & results)
- Top searches aggregation banner
- Multi-select image grid with counter
- TailwindCSS + separate high-level CSS files for each section (Login, Dashboard, History, Components)
- GitHub Actions workflow for CI (install + client build)
- README and `.env.example` files

## Quickstart

### Server

```bash
cd server
npm install
cp .env.example .env
# fill .env values
npm run dev
```

### Client

```bash
cd client
npm install
# optional: create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

## Screenshots (placeholders)

- OAuth login — /screenshots/oauth-login.png
- Top searches banner — /screenshots/top-banner.png
- Search results multi-select — /screenshots/search-multiselect.png
- Search history — /screenshots/history.png

## CI / GitHub Actions

`.github/workflows/ci.yml` runs npm install for both server and client and attempts a client build on push to main.

## Notes

- Make sure OAuth callback URLs are set to `http://localhost:5000/api/auth/<provider>/callback` in provider developer consoles.
