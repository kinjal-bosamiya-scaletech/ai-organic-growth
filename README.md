# Organiq — Frontend

The frontend for **Organiq** ("AI Organic Growth"), an AI-powered SEO / organic-growth
platform. Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui, currently running
entirely on **mock data** behind a feature flag so it can be pointed at the real
`../backend` API later with no component changes.

## Tech stack

| Concern | Choice |
|---|---|
| Build tool | Vite |
| Language | TypeScript |
| UI framework | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme`) |
| Components | shadcn/ui (Base UI primitives) |
| Routing | react-router (data router, `createBrowserRouter`) |
| Server state | TanStack Query |
| HTTP client | axios (wrapped in `services/http.service.ts`) |
| Charts | chart.js + react-chartjs-2 |
| Map | chartjs-chart-geo + world-atlas (lazy-loaded, no API key) |
| Notifications | react-toastify |
| Icons | lucide-react |

## Getting started

From the repo root (recommended, uses the pnpm workspace):

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Or from this directory directly:

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` if you want to override the defaults (mocks are on by
default, so this isn't required to run the app):

```bash
cp .env.example .env
```

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Start the Vite dev server with HMR |
| `pnpm build` | Type-check (`tsc -b`) then build for production into `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm typecheck` | Type-check only, no build output |
| `pnpm lint` | Run oxlint |

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_USE_MOCKS` | `true` | When `true` (or unset), every `services/*.service.ts` call resolves from local mock data with simulated latency instead of hitting the network. Set to `false` once `../backend` is ready. |
| `VITE_API_BASE_URL` | — | Base URL axios prefixes requests with when `VITE_USE_MOCKS=false`. |

## Project structure

```
src/
├── routes/          createBrowserRouter tree + the pathless RootLayout (toasts, error interceptor)
├── layouts/          AuthLayout (public), AppLayout (sidebar + topbar shell)
├── components/
│   ├── ui/            shadcn primitives — generated, don't hand-edit
│   ├── common/         ErrorBoundary, ErrorHandler, RouteErrorBoundary, QueryErrorFallback,
│   │                   ProtectedRoute, PageLoader, EmptyState, StatCard, SectionCard
│   ├── charts/          SparklineChart, TrendAreaChart, GaugeChart (chart.js)
│   └── layout/         Sidebar, SidebarNavItem, Topbar, UserMenu
├── features/           one folder per screen (auth, projects, dashboard, ai-chat,
│                       recommendations, seo-analysis, competitors, settings) —
│                       each has a `<X>Page.tsx` and a `components/` folder of
│                       small, single-purpose pieces
├── context/            AuthContext (mock sign-in/out, sessionStorage-backed)
├── hooks/               useAuth, useActiveProject, queries/ (one TanStack Query hook
│                       per domain, keyed via queryKeys.ts)
├── services/            http.service.ts (axios wrapper), auth.service.ts (token
│                       storage), one `<domain>.service.ts` per feature — see
│                       "API contract" below
├── lib/                 api-endpoints.ts (path map + query-string helper),
│                       constants.ts (nav config), mockDelay.ts, utils.ts (cn())
├── mocks/data/          the mock dataset each service resolves from
└── types/               shared TS types, one file per domain
```

## Routing

```
/login                                  → public, redirects to /projects if already signed in
/projects                                → property picker + connect flow
/app/:projectId/dashboard                → default landing page for a connected property
/app/:projectId/ai-chat
/app/:projectId/recommendations
/app/:projectId/seo-analysis
/app/:projectId/competitors
/app/:projectId/settings
```

`/projects` and everything under `/app` sit behind `ProtectedRoute` (redirects to
`/login` if not signed in — sign-in is mocked, see `context/AuthContext.tsx`).
`AppLayout` resolves the active project from the `:projectId` URL param and exposes
it to nested pages via `useActiveProject()` (React Router outlet context), so feature
pages don't re-fetch it.

## The "API-ready" mock pattern

Every function in `services/*.service.ts` has the same signature regardless of
where its data comes from. Internally it branches on `VITE_USE_MOCKS`:

```ts
export async function getKeywords(projectId: string): Promise<Keyword[]> {
  if (USE_MOCKS) return mockDelay(keywordsMock);
  return httpService.get<Keyword[]>(API_CONFIG.keywords(projectId));
}
```

`hooks/queries/*` wrap these in `useQuery`/`useMutation`. To switch a domain over to
a real backend, implement the endpoint below and flip `VITE_USE_MOCKS=false` —
no component or hook changes needed.

### REST contract expected by the frontend

| Method | Path | Used by |
|---|---|---|
| `GET` | `/projects` | `projects.service.ts` → property list |
| `GET` | `/projects/:id` | `projects.service.ts` → single property |
| `POST` | `/projects/:id/connect` | `projects.service.ts` → grants access, returns the now-connected `Project` |
| `GET` | `/projects/:id/keywords` | `keywords.service.ts` |
| `GET` | `/projects/:id/recommendations` | `recommendations.service.ts` |
| `POST` | `/recommendations/:id/apply` | `recommendations.service.ts` |
| `GET` | `/projects/:id/competitors` | `competitors.service.ts` |
| `GET` | `/projects/:id/seo-analysis` | `seo.service.ts` |
| `POST` | `/projects/:id/chat` `{ text }` | `chat.service.ts` → returns an AI `ChatMessage` |

Response shapes are the TypeScript types in `src/types/` (`Project`, `Keyword`,
`Recommendation`, `Competitor`, `SeoIssue`/`CwvMetric`/`SeoBreakdownItem`,
`ChatMessage`).

## Error handling

- `ErrorBoundary` — class component at the app root, catches render errors.
- `ErrorHandler` — mounted once in `RootLayout`, registers axios response
  interceptors: toasts non-GET success messages and every failure via
  react-toastify, and signs the user out on 401/403.
- `RouteErrorBoundary` — wired as `errorElement` on every route so one page's
  failure doesn't blank the whole app.
- `QueryErrorFallback` — small presentational fallback each feature page renders
  when its query `isError`.

## Notes

- No backend is wired up yet — see `../backend/README.md`.
- Auth is fully mocked (`context/AuthContext.tsx` + `services/auth.service.ts`);
  "Continue with Google" just marks a session as signed in.
