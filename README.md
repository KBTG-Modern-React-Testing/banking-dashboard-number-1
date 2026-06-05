# 🏦 Modern Banking Dashboard

A sleek, dark-themed banking dashboard built with **Next.js 16**, **React 19**, and **TanStack Query**. Monitor your account balance, review transaction history, and initiate fund transfers — all from a single-page dashboard with real-time settlement simulation.

![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33?logo=playwright)

---

## ✨ Features

- **Account Balance** — Real-time balance display with automatic refresh after transfers
- **Transaction History** — Filterable list (All / Pending / Completed / Failed) with status badges
- **Fund Transfers** — Form with validation, optimistic UI updates, and error handling
- **Transaction Settlement** — Simulated bank processing (Pending → Completed after 3 seconds) with automatic balance deduction
- **Dark / Light Theme** — Toggle with localStorage persistence and zero-flash hydration
- **Responsive Layout** — Mobile-first grid with hamburger nav for small screens
- **Error Boundary** — Graceful error handling with retry capability
- **Loading States** — Skeleton placeholders and animated loading indicators

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) + Custom CSS Design System |
| State Management | [TanStack Query v5](https://tanstack.com/query) (server state) |
| UI Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Unit Testing | [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [MSW 2](https://mswjs.io/) |
| E2E Testing | [Playwright](https://playwright.dev/) |
| Font | [Inter](https://fonts.google.com/specimen/Inter) + [Geist Mono](https://vercel.com/font) |

### Design System

The UI follows an **xAI-inspired design language** with:

- **Color palette**: Sunset orange (`#ff7a17`), Dusk purple (`#7c3aed`), Twilight violet — with full dark/light theme support via CSS custom properties
- **Typography**: Display scale (96px → 20px), body scale, monospace eyebrow labels
- **Components**: Surface cards, pill buttons (primary + outline), status badges, input fields
- **Animations**: Fade-in, slide-up, pulse-glow, spin — all CSS keyframe-based

---

## 📁 Project Structure

```
banking-dashboard-number-1/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── balance/route.ts      # GET /api/balance
│   │   └── transactions/route.ts # GET & POST /api/transactions
│   ├── globals.css               # Design system tokens & utilities
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   ├── page.tsx                  # Dashboard page
│   ├── error.tsx                 # Error boundary
│   └── loading.tsx               # Loading UI
│
├── components/                   # React components
│   ├── BalanceCard.tsx           # Account balance display
│   ├── NavBar.tsx                # Sticky nav with theme toggle
│   ├── TransactionList.tsx       # Filterable transaction history
│   ├── TransactionFilters.tsx    # Status filter pills
│   ├── TransferForm.tsx          # Transfer form with validation
│   ├── Providers.tsx             # Combined provider wrapper
│   ├── QueryProvider.tsx         # TanStack Query client provider
│   ├── ThemeProvider.tsx         # Dark/light theme context
│   └── ui/
│       └── button.tsx            # shadcn/ui Button (CVA-based)
│
├── lib/                          # Shared utilities & logic
│   ├── store.ts                  # In-memory data store with settlement simulation
│   ├── types.ts                  # TypeScript interfaces
│   ├── formatters.ts             # Currency & date formatting (Intl API)
│   ├── utils.ts                  # clsx + tailwind-merge helper
│   └── hooks/
│       ├── use-balance.ts        # useQuery hook for balance
│       ├── use-transactions.ts   # useQuery hook for transactions
│       └── use-transfer.ts       # useMutation hook with optimistic updates
│
├── mocks/                        # Mock Service Worker (unit tests)
│   ├── handlers.ts               # MSW request handlers + settlement factory
│   └── server.ts                 # MSW Node server setup
│
├── __tests__/                    # Vitest unit tests
│   ├── setup.ts                  # Test setup (MSW lifecycle, mocks)
│   ├── BalanceCard.test.tsx
│   ├── NavBar.test.tsx
│   ├── Settlement.test.tsx       # Settlement flow tests
│   ├── ThemeProvider.test.tsx
│   ├── TransactionList.test.tsx
│   └── TransferForm.test.tsx
│
├── e2e/                          # Playwright E2E tests
│   ├── fixtures/
│   │   └── test-data.ts          # Shared test constants
│   ├── api.spec.ts               # API route tests
│   ├── dashboard.spec.ts         # Dashboard UI tests
│   ├── homepage.spec.ts          # Homepage rendering tests
│   ├── mobile.spec.ts            # Mobile responsive tests
│   ├── settlement.spec.ts        # Settlement E2E tests
│   ├── theme.spec.ts             # Theme toggle tests
│   └── transfer.spec.ts          # Transfer flow tests
│
├── next.config.ts                # Next.js configuration
├── vitest.config.mts             # Vitest configuration
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── postcss.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22.x
- **npm** ≥ 10.x

### Installation

```bash
git clone git@github.com:KBTG-Modern-React-Testing/banking-dashboard-number-1.git
cd banking-dashboard-number-1
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

```bash
npm run build
npm start
```

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server with hot reload |
| `build` | `npm run build` | Create production build |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `test` | `npm test` | Run unit tests (Vitest, single run) |
| `test:watch` | `npm run test:watch` | Run unit tests in watch mode |
| `test:e2e` | `npm run test:e2e` | Run E2E tests (Playwright, headless) |
| `test:e2e:ui` | `npm run test:e2e:ui` | Run E2E tests with Playwright UI mode |
| `test:e2e:headed` | `npm run test:e2e:headed` | Run E2E tests in headed browser |

---

## 🧪 Testing

### Strategy

The project uses a **two-layer testing strategy**:

| Layer | Tool | Purpose | Count |
|-------|------|---------|-------|
| **Unit** | Vitest + Testing Library + MSW | Component behavior, hooks, rendering | 54 tests |
| **E2E** | Playwright | Full user flows in real browser | 52 tests |

### Unit Tests (Vitest + MSW)

Unit tests run in a **jsdom** environment with [Mock Service Worker (MSW v2)](https://mswjs.io/) intercepting all `fetch` calls at the network level — no manual `fetch` mocking required.

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch
```

**Key patterns:**
- MSW handlers defined in `mocks/handlers.ts` provide default API responses
- Per-test overrides via `server.use()` for error/edge cases
- `createSettlementHandlers(delayMs)` factory for settlement flow testing
- Automatic cleanup via `afterEach(() => server.resetHandlers())`

### E2E Tests (Playwright)

E2E tests run against the real Next.js dev server on `localhost:3000` using Chromium.

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Headed mode (see the browser)
npm run test:e2e:headed
```

**Configuration highlights:**
- Auto-starts dev server via `webServer` config
- Traces on first retry, screenshots on failure
- CI mode: single worker, 2 retries, `forbidOnly` enabled

---

## 💰 Transaction Settlement Flow

The dashboard simulates realistic banking transaction processing:

```
Transfer submitted → Pending (immediate) → Completed (3s delay) → Balance deducted
```

### How It Works

1. **User submits transfer** → `POST /api/transactions` creates a `Pending` transaction
2. **Optimistic update** → `useTransfer` hook immediately deducts balance in the UI cache
3. **Server schedules settlement** → `setTimeout(3000ms)` in `lib/store.ts`
4. **After 3 seconds** → Transaction status changes to `Completed`, server balance is deducted
5. **Query invalidation** → TanStack Query refetches balance & transactions for consistency

The balance is floor-clamped at `$0.00` — it will never go negative.

---

## 🎨 Theming

The dashboard supports **dark** and **light** themes via CSS custom properties on the `[data-theme]` attribute.

| Token | Dark | Light |
|-------|------|-------|
| `--canvas` | `#0a0a0a` | `#f5f5f7` |
| `--ink` | `#ffffff` | `#0a0a0a` |
| `--accent-sunset` | `#ff7a17` | `#e56a0f` |
| `--accent-dusk` | `#7c3aed` | `#6d28d9` |
| `--canvas-card` | `#191919` | `#ffffff` |

Theme preference is persisted in `localStorage` under the key `banking-theme`.

---

## 🔧 Configuration

### Next.js (`next.config.ts`)

```ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"], // Tree-shake unused icons
  },
};
```

### Vitest (`vitest.config.mts`)

```ts
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    exclude: ["**/e2e/**", "**/node_modules/**"],
    css: false,
  },
});
```

### Playwright (`playwright.config.ts`)

- **Test dir**: `./e2e`
- **Base URL**: `http://localhost:3000`
- **Browser**: Chromium (Desktop Chrome)
- **Web server**: Auto-starts `npm run dev`

---

## 📡 API Reference

### `GET /api/balance`

Returns the current account balance.

**Response:**
```json
{
  "balance": 15000.5,
  "currency": "USD"
}
```

### `GET /api/transactions`

Returns all transactions, sorted by creation date (newest first).

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn_001",
      "amount": 1500.00,
      "currency": "USD",
      "status": "Completed",
      "description": "Payment to vendor",
      "recipient": "Acme Corp",
      "createdAt": "2026-06-04T08:30:00Z",
      "updatedAt": "2026-06-04T08:31:00Z"
    }
  ]
}
```

### `POST /api/transactions`

Creates a new transfer. The transaction starts as `Pending` and auto-settles to `Completed` after 3 seconds.

**Request body:**
```json
{
  "amount": 100.00,
  "recipient": "John Doe",
  "description": "Optional note"
}
```

**Response (201):**
```json
{
  "transaction": {
    "id": "txn_008",
    "amount": 100.00,
    "currency": "USD",
    "status": "Pending",
    "description": "Optional note",
    "recipient": "John Doe",
    "createdAt": "2026-06-05T08:00:00Z",
    "updatedAt": "2026-06-05T08:00:00Z"
  }
}
```

**Error responses:**

| Status | Condition |
|--------|-----------|
| `400` | Missing or invalid `amount` (must be a positive number) |
| `400` | Missing or empty `recipient` |
| `400` | Malformed JSON body |

---

## 🧩 Key Components

### `BalanceCard`
Displays the current account balance with a gradient accent line. Shows skeleton loader during fetch, error state with retry button on failure.

### `TransactionList`
Renders a filterable transaction history. Supports status filters (All / Pending / Completed / Failed) via pill-shaped toggle buttons. Each transaction shows amount, recipient, status badge, and timestamp.

### `TransferForm`
A form with client-side validation for amount (positive number) and recipient (required). Uses optimistic updates — the balance deducts immediately in the UI before server confirmation, with automatic rollback on error.

### `ThemeProvider`
React context provider that manages dark/light theme state. Reads from `localStorage` on mount and syncs the `data-theme` attribute on `<html>` for CSS custom property switching.

---

## 📦 Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `next` | React framework with App Router |
| `react` / `react-dom` | UI library |
| `@tanstack/react-query` | Server state management (caching, refetch, mutations) |
| `lucide-react` | Icon library |
| `radix-ui` | Accessible UI primitives |
| `shadcn` | Component generation CLI |
| `class-variance-authority` | Component variant management |
| `clsx` + `tailwind-merge` | Conditional class composition |
| `tw-animate-css` | Tailwind CSS animation utilities |

### Development

| Package | Purpose |
|---------|---------|
| `vitest` | Unit test runner (Vite-powered) |
| `@testing-library/react` | Component testing utilities |
| `@testing-library/user-event` | User interaction simulation |
| `msw` | API mocking at the network level |
| `@playwright/test` | E2E testing framework |
| `jsdom` | Browser environment for unit tests |
| `tailwindcss` + `@tailwindcss/postcss` | CSS framework |
| `typescript` | Type checking |
| `eslint` + `eslint-config-next` | Code linting |
| `@vitejs/plugin-react` | React support for Vitest |
| `vite-tsconfig-paths` | Path alias resolution in tests |

---

## 🗄️ Data Model

```typescript
type TransactionStatus = "Pending" | "Completed" | "Failed";

interface Transaction {
  id: string;            // e.g., "txn_001"
  amount: number;        // e.g., 1500.00
  currency: string;      // e.g., "USD"
  status: TransactionStatus;
  description: string;   // e.g., "Payment to vendor"
  recipient?: string;    // e.g., "Acme Corp"
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}

interface BalanceResponse {
  balance: number;       // e.g., 15000.5
  currency: string;      // e.g., "USD"
}
```

---

## 📄 License

This project is private and part of the KBTG Modern React Testing curriculum.
