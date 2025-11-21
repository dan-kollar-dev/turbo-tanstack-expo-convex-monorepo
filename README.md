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
- pnpm >= 10.0.0

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
   - Copy `.env.local.example` files to `.env.local` in each app:
     - `apps/web/.env.local.example` → `apps/web/.env.local`
     - `apps/mobile/.env.local.example` → `apps/mobile/.env.local`
     - `packages/backend/.env.local.example` → `packages/backend/.env.local` (optional, usually auto-configured)
   - Add your Convex deployment URL to the environment files
   - Note: Web app uses `VITE_` prefix, mobile app uses `EXPO_PUBLIC_` prefix

4. Run development servers:
   ```bash
   pnpm dev
   ```
   This will start all apps in development mode.

## Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking across all packages
- `pnpm clean` - Clean build artifacts

## Individual App Scripts

### Web App (`apps/web`)

- `pnpm dev` - Start TanStack Start dev server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

### Mobile App (`apps/mobile`)

- `pnpm dev` - Start Expo dev server
- `pnpm start` - Start Expo dev server (alias for dev)
- `pnpm build` - Build for web export
- `pnpm android` - Run on Android
- `pnpm ios` - Run on iOS
- `pnpm web` - Run in web browser
- `pnpm reset-project` - Reset project to template state
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

### Backend (`packages/backend`)

- `pnpm dev` - Start Convex dev server
- `pnpm deploy` - Deploy to production
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm clean` - Clean build artifacts

### Shared (`packages/shared`)

- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm clean` - Clean build artifacts

## Workspace Packages

- `@repo/shared` - Shared TypeScript types and utilities
- `@repo/backend` - Convex backend functions
- `@repo/web` - TanStack Start web app
- `@repo/mobile` - Expo mobile app

## Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm (version pinned)
- **Web Framework**: TanStack Start
- **Mobile Framework**: Expo
- **Backend**: Convex
- **Language**: TypeScript
- **UI Framework**: React 19
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky
