# SiteRoast Railway Deploy

## What Railway Needs

Create one Railway project with:

1. `siteroast` app service from this folder
2. `PostgreSQL` database service

The app already includes:

- [railway.toml](/Users/brianfitzgerald/untitled%20folder/siteroast/railway.toml)
- [Dockerfile](/Users/brianfitzgerald/untitled%20folder/siteroast/Dockerfile)
- Prisma schema and production migrate step

## Required Environment Variables

Set these on the `siteroast` Railway service:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ONE_TIME=
STRIPE_PRICE_SUBSCRIPTION=
BROWSERLESS_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Minimum values to get the app booting:

- `DATABASE_URL` from Railway Postgres
- `NEXTAUTH_SECRET` generated with `openssl rand -base64 32`
- `NEXTAUTH_URL` set to your Railway public domain
- `NEXT_PUBLIC_APP_URL` set to the same Railway public domain
- Stripe and analysis keys if you want payments + roasting to function

## Railway Steps

1. Push `siteroast` to GitHub.
2. In Railway, create a new project from that repo.
3. Set the root directory to `siteroast`.
4. Add a PostgreSQL service.
5. Copy the Postgres connection string into `DATABASE_URL`.
6. Add the remaining env vars from `.env.example`.
7. Generate a public domain for the app service.
8. Set both `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to that domain.
9. Redeploy the service.

## Stripe Setup

Create these products in Stripe:

- Single Report: one-time `$29`
- Unlimited: recurring `$99/month`

Then copy the resulting price IDs into:

- `STRIPE_PRICE_ONE_TIME`
- `STRIPE_PRICE_SUBSCRIPTION`

After the app is deployed, create a Stripe webhook pointing to:

```text
https://your-domain.up.railway.app/api/webhooks/stripe
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Notes

- The Docker image runs `prisma migrate deploy` at container start.
- Production builds were verified locally before writing this guide.
- If Google auth is not needed, leave `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` empty.
