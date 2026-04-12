# Contributing to Admin Dashboard

## Setup
1. Install Node.js 16
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev`
4. Run tests: `pnpm test`

## Code Style
- Use CSS Modules for styling (create .module.css files)
- Use Redux Toolkit for state management
- Use Axios interceptors for auth token injection

## Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Add navigation item in `src/components/Navigation.tsx`

## Deployment
Push to `master` branch triggers auto-deploy to production.
