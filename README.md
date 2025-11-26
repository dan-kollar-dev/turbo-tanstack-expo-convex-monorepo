# Convex Monorepo

A monorepo setup using Turborepo with Yarn workspaces, TanStack Start (web), Expo (mobile), and Convex (backend).

## Structure

```
/
├── apps/
│   ├── backend/      # Convex backend functions
│   ├── web/          # TanStack Start web application
│   └── mobile/       # Expo mobile application
├── packages/
│   ├── convex-client/ # Convex client API re-exports
│   └── shared/       # Shared TypeScript types and utilities
```

## Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0 (Classic)

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set up Convex:

   ```bash
   cd apps/backend
   npx convex dev
   ```

   Follow the prompts to create a new Convex project or link to an existing one.

3. Configure environment variables:
   - Copy `.env.local.example` files to `.env.local` in each app:
     - `apps/web/.env.local.example` → `apps/web/.env.local`
     - `apps/mobile/.env.local.example` → `apps/mobile/.env.local`
     - `apps/backend/.env.local.example` → `apps/backend/.env.local` (optional, usually auto-configured)
   - Add your Convex deployment URL to the environment files
   - Note: Web app uses `VITE_` prefix, mobile app uses `EXPO_PUBLIC_` prefix

4. Run development servers:
   ```bash
   yarn dev
   ```
   This will start all apps in development mode using Turborepo.

## Dependency Management

This monorepo uses **Yarn v1 (Classic)** with workspace hoisting configured to isolate React dependencies between the web and mobile applications. This allows each app to use different React versions without conflicts.

The root `package.json` uses `nohoist` configuration to prevent React and related packages from being hoisted to the root `node_modules`, ensuring each workspace maintains its own isolated React instance.

For detailed information about the hoisting configuration, troubleshooting common issues, and understanding how dependency isolation works in this monorepo, see the [Monorepo Troubleshooting Guide](docs/monorepo-troubleshooting.md).

## Available Scripts

- `yarn dev` - Start all apps in development mode
- `yarn build` - Build all apps
- `yarn lint` - Lint all packages
- `yarn lint:fix` - Fix linting issues automatically
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn type-check` - Run TypeScript type checking across all packages
- `yarn clean` - Clean build artifacts

## Individual App Scripts

### Web App (`apps/web`)

- `yarn dev` - Start TanStack Start dev server
- `yarn build` - Build for production
- `yarn serve` - Preview production build
- `yarn test` - Run tests with Vitest
- `yarn lint` - Lint code
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn type-check` - Run TypeScript type checking
- `yarn clean` - Clean build artifacts

### Mobile App (`apps/mobile`)

- `yarn dev` - Start Expo dev server
- `yarn start` - Start Expo dev server (alias for dev)
- `yarn build` - Build for web export
- `yarn android` - Run on Android
- `yarn ios` - Run on iOS
- `yarn web` - Run in web browser
- `yarn reset-project` - Reset project to template state
- `yarn lint` - Lint code
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn type-check` - Run TypeScript type checking
- `yarn clean` - Clean build artifacts

### Backend (`apps/backend`)

- `yarn dev` - Start Convex dev server
- `yarn deploy` - Deploy to production
- `yarn type-check` - Run TypeScript type checking
- `yarn lint` - Lint code
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn clean` - Clean build artifacts

### Shared (`packages/shared`)

- `yarn type-check` - Run TypeScript type checking
- `yarn lint` - Lint code
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn clean` - Clean build artifacts

## Workspace Packages

- `@repo/shared` - Shared TypeScript types and utilities
- `@repo/backend` - Convex backend functions
- `@repo/convex-client` - Convex client API re-exports
- `@repo/web` - TanStack Start web app
- `@repo/mobile` - Expo mobile app

## Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: Yarn v1 (Classic)
- **Web Framework**: TanStack Start
- **Mobile Framework**: Expo
- **Backend**: Convex
- **Language**: TypeScript
- **UI Framework**: React 19
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky
