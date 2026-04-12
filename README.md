# Facebook Admin Dashboard

Internal operations dashboard for Facebook's admin and moderation teams.

## Architecture

Built with Next.js 14 App Router using a clean separation between server and client components. All data fetching uses TanStack Query for caching and optimistic updates. Authentication is handled by NextAuth.js with JWT sessions and role-based access enforced at the middleware layer.

## Pages Overview

| Page | Path | Access |
|------|------|--------|
| Dashboard | `/` | All roles |
| Users | `/users` | super_admin, content_moderator |
| User Detail | `/users/[id]` | super_admin, content_moderator |
| Moderation Queue | `/moderation` | super_admin, content_moderator |
| Content Review | `/moderation/[id]` | super_admin, content_moderator |
| Ad Review Queue | `/ads` | super_admin, ad_reviewer |
| Ad Campaign Detail | `/ads/[id]` | super_admin, ad_reviewer |
| Analytics | `/analytics` | All roles |
| System Health | `/system` | super_admin |
| Audit Log | `/audit` | super_admin |
| Settings | `/settings` | super_admin |

## Authentication

NextAuth.js with credentials provider that authenticates against the internal auth-service. Sessions use JWT strategy with 8-hour expiry. Roles are injected into the JWT and session at login time.

## Role-Based Access

| Role | Capabilities |
|------|-------------|
| `super_admin` | Full access to all features |
| `content_moderator` | Users (limited), Moderation, Analytics |
| `ad_reviewer` | Ad Review, Analytics |
| `analyst` | Analytics (read-only) |

Route protection is enforced in `src/middleware.ts` — unauthenticated users are redirected to `/login`, unauthorized users are redirected to `/`.

## API Integration

All API calls go through the Axios client at `src/lib/api/client.ts`, which:
- Injects Bearer tokens from the NextAuth session
- Retries on 429/502/503/504 with exponential backoff (max 3 retries)
- Redirects to `/login` on 401

TanStack Query hooks in `src/hooks/` provide caching, optimistic updates, and background refetching.

## Component Library

shadcn/ui-style components using Class Variance Authority (CVA) + Tailwind CSS:

- `src/components/ui/` — Base components (button, input, badge, card, dialog, dropdown, select, tabs, avatar, skeleton, toast)
- `src/components/common/` — Shared app components (data-table, search-input, status-badge, confirm-dialog, pagination)
- `src/components/layout/` — Sidebar, header, breadcrumb
- Feature components in `users/`, `moderation/`, `ads/`, `analytics/`, `system/`

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Format code
npm run format
```

### Environment Variables

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
AUTH_SERVICE_URL=http://localhost:8081
```

## Deployment

### Docker

```bash
docker build -t admin-dashboard .
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-url/api/v1 \
  admin-dashboard
```

### Docker Compose

```bash
docker-compose up
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): Lint → Type-check → Test → Build on every push and PR
- **CD** (`.github/workflows/cd.yml`): Docker build & push to GHCR → Deploy to production on `main` branch pushes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query v5
- **Authentication**: NextAuth.js v4
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library
- **Containerization**: Docker (multi-stage build, standalone output)
