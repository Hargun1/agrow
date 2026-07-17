# Happhygreenz Interactive Lead-Gen Kiosk

Offline-tolerant React/Express kiosk for the Happhygreenz trade-show funnel, with Supabase lead storage and automated email delivery of each captured blueprint result.

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

- `PORT`: server port, defaults to `5000`
- `CLIENT_ORIGIN`: deployed/local client origin for CORS
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase server-side secret/service-role key

Email:

- `EMAIL_PROVIDER`: `brevo` or `resend`; if omitted, the server auto-detects Brevo first, then Resend
- `BREVO_API_KEY`: Brevo API key
- `BREVO_SENDER_EMAIL`: verified Brevo sender email
- `BREVO_SENDER_NAME`: optional sender name shown to recipients
- `RESEND_API_KEY`: Resend API key
- `MAIL_FROM`: sender label/address
- `MAIL_TO`: optional internal recipient for lead notifications

If you want to use Brevo, set `EMAIL_PROVIDER=brevo` and fill the Brevo values. If you want to keep Resend, set `EMAIL_PROVIDER=resend` and keep `RESEND_API_KEY` plus `MAIL_FROM`.

## Supabase Setup

Run the SQL in `server/supabase-schema.sql` in the Supabase SQL editor. The backend uses the server-side Supabase key, so do not put `SUPABASE_SERVICE_ROLE_KEY` in the frontend environment.

Lead records are stored with flat columns for filtering plus a `submission_details` JSONB field that keeps the full contact, quiz, and blueprint payload together.
If the table already exists, rerun the schema SQL so the `submission_details` column is added in place.

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
