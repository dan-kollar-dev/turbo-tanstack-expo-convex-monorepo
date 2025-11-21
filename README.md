# Convex Monorepo

A monorepo setup using Turborepo, pnpm workspaces, TanStack Start (web), Expo (mobile), and Convex (backend).

## Structure

```
/
├── apps/
│   ├── web/          # TanStack Start web application
│   └── mobile/       # Expo mobile application
├── packages/
│   ├── backend/      # Convex backend functions
│   └── shared/       # Shared TypeScript types and utilities
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up Convex:
   ```bash
   cd packages/backend
   npx convex dev
   ```
   Follow the prompts to create a new Convex project or link to an existing one.

3. Configure environment variables:
   - Copy `.env.local.example` files in `apps/web` and `apps/mobile`
   - Add your Convex deployment URL to the environment files

4. Run development servers:
   ```bash
   pnpm dev
   ```
   This will start all apps in development mode.

## Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Run TypeScript type checking across all packages

## Individual App Scripts

### Web App (`apps/web`)
- `pnpm dev` - Start TanStack Start dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Mobile App (`apps/mobile`)
- `pnpm dev` - Start Expo dev server
- `pnpm android` - Run on Android
- `pnpm ios` - Run on iOS
- `pnpm web` - Run in web browser

### Backend (`packages/backend`)
- `pnpm dev` - Start Convex dev server
- `pnpm deploy` - Deploy to production

## Workspace Packages

- `@repo/shared` - Shared TypeScript types and utilities
- `@repo/backend` - Convex backend functions
- `@repo/web` - TanStack Start web app
- `@repo/mobile` - Expo mobile app

## Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Web Framework**: TanStack Start
- **Mobile Framework**: Expo
- **Backend**: Convex
- **Language**: TypeScript

