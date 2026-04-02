# Deploying to Vercel

This project is configured to deploy a static frontend (Vite build) and serverless API functions on Vercel.

The repository root is the deployable Vite app. The separate `admin/` folder is its own Next.js app and should only be deployed as a separate Vercel project with `admin` set as the Root Directory.

## Quick steps

1. Commit and push your changes to the repository.
2. In the Vercel dashboard, create a new project and import the repository.
3. Set the framework preset to `Vite`, then set the build command to:

```bash
npm run build
```

1. Set the output directory to:

```text
dist
```

1. Add the environment variables (Project Settings → Environment Variables):

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (server-side only)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_API_BASE_URL (optional; leave empty to use same-origin)
- VITE_ADMIN_EMAILS (optional)
- BOOKING_CALENDAR_TOKEN (optional; protects /api/bookings/calendar when set)

Security note: do NOT expose `SUPABASE_SERVICE_ROLE_KEY` in client builds — only set it in Vercel's server-side env configuration.

## Local testing

- Run backend + frontend concurrently (single-port dev):

```bash
npm run dev:single
```

- Or run the dev stack using Vercel's local simulator:

```bash
vercel dev
```

## CI / CLI deploy

- To deploy from your machine using the Vercel CLI:

```bash
vercel --prod
```

## Notes

- `vercel.json` is included to configure static build and serverless functions.
- `vercel.json` explicitly pins the root app to the `vite` preset so Vercel does not try to detect Next.js from the repository root.
- If you want to deploy `admin/`, create a second Vercel project and set its Root Directory to `admin` so Vercel reads `admin/package.json`, where `next` is declared.
- The `/api` folder maps to Vercel functions; keep server-only secrets in Vercel environment settings.
