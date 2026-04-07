#!/bin/bash
set -e
echo "========================================="
echo "  SiteRoast Setup Script"
echo "========================================="
echo ""
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install from https://nodejs.org"; exit 1; }

echo "Step 1: Install dependencies"
npm install

echo ""
echo "Step 2: Set up environment variables"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
else
  echo ".env already exists, skipping"
fi

echo ""
echo "Fill in .env with:"
echo "  1. DATABASE_URL - Railway Postgres connection string"
echo "  2. NEXTAUTH_SECRET - Run: openssl rand -base64 32"
echo "  3. STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY from https://dashboard.stripe.com/apikeys"
echo "     Create 2 products: Single Report (\$29 one-time), Unlimited (\$99/mo recurring)"
echo "     Copy Price IDs to STRIPE_PRICE_ONE_TIME and STRIPE_PRICE_SUBSCRIPTION"
echo "  4. STRIPE_WEBHOOK_SECRET - Create webhook after deploying"
echo "  5. BROWSERLESS_API_KEY from https://www.browserless.io/"
echo "  6. ANTHROPIC_API_KEY from https://console.anthropic.com/"
echo "  7. NEXT_PUBLIC_APP_URL - http://localhost:3000 for dev"
echo ""
echo "Press Enter after filling in .env..."
read

echo "Step 3: Set up database"
npx prisma migrate dev --name init

echo "Step 4: Generate Prisma client"
npx prisma generate

echo "Step 5: Build the app"
npm run build

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo "To run locally:  npm run dev"
echo "To deploy: Push to GitHub, connect in Railway, add env vars"
