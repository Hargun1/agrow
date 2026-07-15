# Happhygreenz Interactive Lead-Gen Kiosk

Offline-tolerant MERN kiosk for the Happhygreenz trade-show funnel, with automated Gmail SMTP delivery of each captured blueprint result.

## Local Setup

```bash
npm run install:all
```

Create `server/.env` from `server/.env.example`, then run:

```bash
npm run dev
```

Client: `http://localhost:5173`  
Server: `http://localhost:5000`

## Server Environment

Required:

- `MONGO_URI`: MongoDB connection string
- `PORT`: server port, defaults to `5000`
- `CLIENT_ORIGIN`: deployed/local client origin for CORS

Gmail SMTP:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER`: Gmail address
- `SMTP_PASS`: Gmail app password
- `MAIL_FROM`: sender label/address
- `MAIL_TO`: optional internal recipient for lead notifications

Gmail usually requires an app password, not your normal Gmail password.

## Offline Sync

On lead submit, the client immediately saves the lead to `localStorage` with `synced: false`, then attempts `POST /api/leads` with a 5 second timeout. If the request fails, the kiosk advances anyway. A global sync service retries unsynced leads every 20 seconds and whenever the browser comes back online.

## Swapping Assets

Replace placeholder files in `client/public/assets/`:

- `hydroponics-bg.svg`
- `tower-render.svg`
- `indoor-rack-render.svg`
- `commercial-polyhouse.svg`
- `agrow-ai-scan.svg`

Keep the same filenames or update `client/src/data/blueprints.js`.

## Deployment

Build the frontend:

```bash
npm run build --prefix client
```

Deploy options:

- Frontend: Vercel/Netlify static site from `client`, build command `npm run build`, output `dist`.
- Backend: Render/Railway/Fly/Node host from `server`, start command `npm start`.
- Set `VITE_API_URL` on the frontend to the deployed backend URL.
- Set all server environment variables on the backend host.

Before public deployment, secure `GET /api/leads`; it is intentionally unauthenticated only for MVP/internal checks.
