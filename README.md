# News Aggregator

A modern news aggregator built with React, TypeScript, and Vite that pulls articles from multiple sources into a unified, filterable feed.

## Features

- **Multi-source aggregation** — Fetches articles from NewsAPI, The Guardian, and the New York Times
- **Unified article model** — Adapter pattern normalizes all API responses into a consistent interface
- **Article search** — Debounced keyword search across all sources
- **Advanced filtering** — Filter by date range, category, and source
- **Personalized feed** — Save preferred sources, categories, and authors (persisted to localStorage)
- **Mobile responsive** — Mobile-first design with collapsible filter drawer
- **Secure API key handling** — Keys are never exposed to the browser; injected server-side via Vite dev proxy and nginx reverse proxy
- **Graceful degradation** — Works even if only 1 of 3 API keys is configured (uses `Promise.allSettled`)
- **Dockerized** — Multi-stage Docker build with nginx reverse proxy for production

## Architecture

```
src/
 ├── app/
 │    └── App.tsx                     # Root component with QueryClientProvider
 ├── components/
 │    ├── layout/
 │    │    └── Layout.tsx             # Header, navigation tabs, responsive shell
 │    ├── article/
 │    │    ├── ArticleCard.tsx        # Individual article card
 │    │    └── ArticleList.tsx        # Responsive grid with loading/error/empty states
 │    ├── filters/
 │    │    ├── SearchBar.tsx          # Debounced keyword search
 │    │    ├── FiltersPanel.tsx       # Date pickers, category select, mobile Sheet
 │    │    └── SourceSelector.tsx     # Source checkboxes
 │    └── ui/                         # shadcn/ui components
 ├── features/
 │    └── personalization/
 │         ├── preferences.store.ts   # Zustand store with localStorage persistence
 │         ├── preferences.types.ts   # UserPreferences interface
 │         └── PreferencesPanel.tsx   # UI for managing preferences
 ├── hooks/
 │    └── useArticles.ts             # React Query hook wrapping the aggregator
 ├── services/
 │    ├── api/
 │    │    ├── newsApi.service.ts     # NewsAPI.org client
 │    │    ├── guardian.service.ts    # The Guardian API client
 │    │    └── nyt.service.ts         # New York Times API client
 │    ├── adapters/
 │    │    ├── newsApi.adapter.ts     # NewsAPI → Article
 │    │    ├── guardian.adapter.ts    # Guardian → Article
 │    │    └── nyt.adapter.ts         # NYT → Article
 │    └── articleAggregator.service.ts # Merges all sources into sorted Article[]
 ├── types/
 │    └── article.ts                  # Article, ArticleFilters, constants
 ├── utils/
 │    └── date.utils.ts              # formatDate, getRelativeTime, toISODateString
 ├── lib/
 │    └── utils.ts                    # shadcn utility (cn)
 └── main.tsx                         # Entry point
```

### Design Principles

- **Single Responsibility**: Each module handles one concern (fetching, adapting, rendering, state)
- **Open/Closed**: New API sources can be added by creating a service + adapter without modifying existing code
- **Adapter Pattern**: Each API has its own adapter that normalizes raw responses into the unified `Article` interface
- **DRY**: Shared filtering logic, reusable UI components
- **KISS**: Simple filter state management, predictable data flow

### Data Flow

```
Browser                     Server (Vite dev / nginx prod)
──────                      ───────────────────────────────
User Input
  → Filters State
  → useArticles (React Query)
  → articleAggregator.service
  → /api/newsapi/...    ──→  Proxy injects apiKey    ──→  newsapi.org
  → /api/guardian/...   ──→  Proxy injects api-key   ──→  guardianapis.com
  → /api/nyt/...        ──→  Proxy injects api-key   ──→  nytimes.com
  ← adapters normalize responses
  ← Merged Article[]
  → ArticleList → ArticleCard
```

> **Security**: API keys never leave the server. The browser only calls local `/api/*` endpoints. In development, Vite's built-in proxy forwards requests with keys injected from `.env`. In production, nginx does the same using environment variables.

## Prerequisites

- **Node.js** >= 20
- **npm** >= 9
- **Docker** (optional, for containerized deployment)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd news-aggregator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API keys

Copy the `.env` file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEWS_API_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
NYT_API_KEY=your_nyt_key
```

> **Note**: Keys intentionally do **not** use the `VITE_` prefix so they are never bundled into client-side code. They are read only by the Vite dev proxy and nginx.

**Get your API keys:**

| Source         | URL                                           |
| -------------- | --------------------------------------------- |
| NewsAPI        | https://newsapi.org/register                  |
| The Guardian   | https://open-platform.theguardian.com/access/ |
| New York Times | https://developer.nytimes.com/accounts/create |

> The app works with just one API key. Missing keys are handled gracefully.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## Docker Deployment

### Build and run with Docker Compose

```bash
# Make sure your .env file has the API keys, then:
docker compose up --build
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### Build and run manually

```bash
docker build -t news-aggregator .

docker run -p 8080:80 \
  -e NEWS_API_KEY=your_key \
  -e GUARDIAN_API_KEY=your_key \
  -e NYT_API_KEY=your_key \
  news-aggregator
```

> API keys are passed as **runtime** environment variables (not build-time args). The nginx container uses `envsubst` to inject them into its reverse proxy config at startup.

## Tech Stack

- **React 19** — UI library
- **TypeScript 5.9** — Type safety
- **Vite 7** — Build tool
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — Accessible component library
- **TanStack React Query** — Data fetching and caching
- **Zustand** — Lightweight state management
- **Axios** — HTTP client
- **date-fns** — Date formatting utilities
- **Lucide React** — Icons
