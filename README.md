## SiteRoast

SiteRoast is a Next.js app that audits websites, scores them, and sells one-time or subscription report access.

## Local Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) or whatever port you assign with `PORT=... npm run dev`.

## Environment Variables

Use [.env.example](/Users/brianfitzgerald/untitled%20folder/siteroast/.env.example) as the template. The important values are:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- Stripe keys and price IDs
- `BROWSERLESS_API_KEY`
- `ANTHROPIC_API_KEY`

## Build

```bash
npm run build
```

## Railway Deploy

Railway deployment is already set up through:

- [railway.toml](/Users/brianfitzgerald/untitled%20folder/siteroast/railway.toml)
- [Dockerfile](/Users/brianfitzgerald/untitled%20folder/siteroast/Dockerfile)
- [RAILWAY-DEPLOY.md](/Users/brianfitzgerald/untitled%20folder/siteroast/RAILWAY-DEPLOY.md)

Use Railway Postgres for `DATABASE_URL`, then set the rest of the service env vars before the first deploy.
