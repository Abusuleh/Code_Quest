# CodeQuest

CodeQuest is a narrative-driven coding education platform for children ages 6–14. This repository is the source of truth for the product build, following the Master Project Mandate.

## Milestone Status

- M1: Project Bootstrap (complete)
- M2: Landing Page Live (in progress)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS 3.4 + CSS Modules
- Prisma + PostgreSQL (Neon)
- ESLint + Prettier + Husky + lint-staged

## Local Setup

Prereqs:

- Node.js LTS
- Git

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Optional analytics/monitoring vars:
`NEXT_PUBLIC_POSTHOG_KEY`, `SENTRY_DSN`.

## Project Structure

```
src/
  app/              # Next.js App Router
  components/       # Atomic design (atoms/molecules/organisms/templates)
  hooks/            # Client hooks
  lib/              # Prisma, auth, services
  store/            # Zustand stores
  styles/           # Design tokens
  types/            # Shared types
prisma/
  schema.prisma
```

## Quality Gates

- TypeScript strict mode
- No `any`
- ESLint clean
- Prettier enforced via Husky + lint-staged

## Deployment

Vercel is the primary deployment target. The project should be connected to GitHub and Vercel for CI/CD.
