# আলোরমেলা - অনলাইন বুকশপ ওয়ার্কস্পেস

## Overview

pnpm workspace monorepo using TypeScript. A full-stack Bengali e-commerce bookshop called "আলোরমেলা" (Aloromela).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Wouter routing, TanStack Query, shadcn/ui, Tailwind CSS
- **Font**: Noto Sans Bengali

## Key Features

- Bengali-language UI throughout
- Book categories: স্কুল (নতুন/পুরাতন), কলেজ (নতুন/পুরাতন), ভার্সিটি, চাকরি, উপন্যাস, গল্প-কবিতা
- Customer registration with SMS OTP verification (mock)
- Book preview ("অল্প পড়ে দেখুন") on book detail pages
- Payment methods: নগদ টাকা, বিকাশ, রকেট, নগদ, সোনালী ব্যাংক, ইসলামী ব্যাংক
- Sell book form for users to submit books they want to sell
- Book demand form (চাহিদাপত্র)
- New author advertisement section (নতুন লেখক)
- Active offers and discounts system
- Slogans: "বই পড়ি, নিই জাতি গড়ার শপথ" and "আলোকিত জাতি, সমৃদ্ধ ভবিষ্যৎ"

## Artifacts

- **aloromela**: React + Vite frontend at `/` (previewPath: `/`)
- **api-server**: Express API server at `/api`

## DB Schema (lib/db/src/schema/)

- `books` - Book catalog with Bengali titles, categories, prices, preview text
- `customers` - Customer registration with address info and OTP verification
- `sell_requests` - Sell book submission forms
- `book_requests` - Book demand/request forms  
- `author_ads` - New author advertisements
- `offers` - Discount/offer system
- `orders` - Order management with payment methods

## GitHub Auto-Sync

Repository: https://github.com/iqbalhimel005/aloromela

Every git commit (including Replit checkpoints) automatically syncs to GitHub via:
- **Hook**: `.git/hooks/post-commit` — runs after every commit
- **Script**: `scripts/github-sync.mjs` — detects changed files and uploads via GitHub API
- **State**: `.local/.github-sync-sha` — tracks last synced commit (gitignored, local only)

The sync runs in the background and does not block development.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `node scripts/github-sync.mjs` — manually trigger GitHub sync

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
