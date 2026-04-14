# Forex AI — Disciplined Trading System

A professional Forex trading assistant that enforces discipline, manages risk, and guides entries/exits across multiple accounts.

**This is NOT a signal bot.** This is a disciplined trading system designed to reduce bad trades, enforce risk management, and improve trader behavior.

---

## Core Principles

- Capital protection is priority #1
- "No trade" is a valid outcome
- Never enter without stop loss
- Never enter without CONFIRMED status
- Always calculate risk per account
- Deny trades when setup quality is low

---

## Architecture

```
Website (Next.js)  →  Analysis + Dashboard
Telegram Bot       →  Alerts + Commands
MetaTrader         →  Execution only (manual)
AI Engine (Claude) →  Decision + Risk + Discipline
```

---

## Quick Start

### 1. Install dependencies

```bash
cd forex-ai-system
npm install
```

### 2. Environment setup

```bash
cp .env.example .env.local
```

Fill in your keys:
- **Supabase**: Create a project at [supabase.com](https://supabase.com)
- **Anthropic**: Get an API key at [console.anthropic.com](https://console.anthropic.com)
- **Telegram**: Create a bot via [@BotFather](https://t.me/BotFather)

### 3. Database setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the app

```bash
npm run dev          # Start Next.js on localhost:3000
npm run bot          # Start Telegram bot (separate terminal)
```

---

## Project Structure

```
forex-ai-system/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── dashboard/         # Main trading dashboard
│   │   ├── pairs/             # Pair listing + analysis
│   │   │   └── [pair]/        # Individual pair page
│   │   ├── journal/           # Trade journal
│   │   ├── settings/          # Account & alert settings
│   │   └── api/               # API routes
│   │       ├── analysis/      # AI analysis endpoint
│   │       ├── risk/          # Risk calculator
│   │       ├── accounts/      # Account management
│   │       ├── journal/       # Journal CRUD
│   │       └── telegram/      # Telegram webhook
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── dashboard/         # Dashboard widgets
│   │   ├── trade/             # Trade-related components
│   │   ├── journal/           # Journal components
│   │   └── shared/            # Shared components
│   ├── config/
│   │   └── trading.ts         # Trading rules & constants
│   ├── hooks/                 # React hooks
│   ├── lib/
│   │   ├── ai/
│   │   │   └── engine.ts      # Claude AI decision engine
│   │   ├── risk/
│   │   │   └── engine.ts      # Risk calculation & validation
│   │   ├── market/
│   │   │   └── denial.ts      # Trade denial system
│   │   ├── telegram/
│   │   │   └── bot.ts         # Telegram bot
│   │   ├── supabase/
│   │   │   └── client.ts      # Supabase client
│   │   └── utils/
│   │       └── index.ts       # Helpers & formatters
│   └── types/
│       └── index.ts           # All TypeScript types
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## Key Systems

### Entry Status System
Every setup must have a status: **WAIT → READY → CONFIRMED → INVALID**
- Only enter on **CONFIRMED**
- System always explains WHY and what must happen next

### Trade Denial System
12 denial checks run before any trade is allowed:
- Weak setup, no confirmation, conflicting signals
- Poor R:R, news too close, overtrading
- Funded rules at risk, daily loss limit, max drawdown
- Consecutive losses, outside session, choppy market

### Risk Engine
- Calculates lot size, pip distance, max loss/profit, R:R
- Validates against account rules (funded vs personal)
- Enforces daily loss and drawdown limits

### Multi-Account System
- Funded: 0.25-0.5% risk, max 3 trades/day, strict filtering
- Personal: 1-2% risk, more flexible, still disciplined

---

## Build Phases

| Phase | What | Status |
|-------|------|--------|
| 1 | Project setup, types, core engines, API routes, bot skeleton | ✅ |
| 2 | Dashboard UI, live data, pair analysis | 🔜 |
| 3 | Telegram bot full integration | 🔜 |
| 4 | Journal + coaching, discipline scoring | 🔜 |
| 5 | Heatmap, best trade, overtrading detection | 🔜 |

---

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes (Node.js)
- **Database**: Supabase (PostgreSQL) via Prisma
- **AI**: Anthropic Claude
- **Bot**: Telegraf (Telegram)
- **Execution**: MetaTrader (manual, user-side only)
