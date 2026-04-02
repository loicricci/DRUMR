# Drumr — P/M Fit Validation Platform

An autonomous CEO agent platform that connects market intelligence, persona understanding, product state, and ad experiments — driving toward product-market fit through structured hypothesis validation.

## Architecture

- **Web app**: Next.js (App Router) deployed on Vercel
- **Database**: PostgreSQL via Supabase (Auth + Storage included)
- **ORM**: Prisma with typed queries and migrations
- **AI agent**: Claude API (claude-sonnet) for all reasoning and generation
- **Agent worker**: Node.js job poller, deployed via GitHub Actions cron
- **Email**: Resend for daily digest notifications

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- A Supabase project (with Auth and PostgreSQL)
- Anthropic API key

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase URL, keys, Anthropic API key, etc.

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Start development
pnpm dev
```

The web app runs at `http://localhost:3000`.

### Agent Worker

```bash
# Run the job poller locally
pnpm --filter @drumr/agent worker poll

# Or trigger daily reports
pnpm --filter @drumr/agent worker daily
```

## Project Structure

```
apps/
  web/          Next.js app (frontend + API routes)
  agent/        Agent worker (job poller + Claude-powered jobs)
packages/
  db/           Prisma schema + migrations
  types/        Shared TypeScript types
.github/
  workflows/    GitHub Actions cron (daily reports, verdict checks)
```

## Key Features

1. **Product registration** with optional data source connections (GitHub, GA4, Google Ads, Twitter/X Ads)
2. **AI-assisted persona creation** through guided chat conversations
3. **Automated market analysis** with AI-powered web research
4. **7-step experiment builder** with falsifiable hypothesis validation
5. **Daily CEO reports** with CONTINUE / PUSH / PAUSE recommendations
6. **Verdict system** that closes the loop — updates personas and proposes next experiments
7. **Email digest** via Resend for daily summaries

## Environment Variables

See `.env.example` for the full list of required environment variables.
