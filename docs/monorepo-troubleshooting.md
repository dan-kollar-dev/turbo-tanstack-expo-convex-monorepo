# Yarn v1 Monorepo Troubleshooting Guide

## Overview

This guide documents solutions for setting up a Yarn v1 monorepo with isolated React dependencies between different applications (e.g., web and mobile apps). The key challenge is preventing dependency hoisting that causes version conflicts and "Invalid hook call" errors.

## Setup Context

- **Package Manager**: Yarn v1 (Classic)
- **Monorepo Tool**: Turbo
- **Applications**:
  - Web app (TanStack Start) using React 19.2.0
  - Mobile app (Expo) using React 19.1.0
- **Critical Requirement**: React dependencies must remain isolated so versions don't need to stay in sync

## Common Issues and Solutions

### Issue 1: Workspace Not Recognized

**Symptom**:

```
warning Missing version in workspace at "/path/to/app", ignoring.
```

**Cause**: Yarn v1 requires a `version` field in all workspace `package.json` files.

**Solution**: Add `"version": "0.0.1"` (or appropriate version) to each workspace's `package.json`.

**Verification**:

```bash
yarn workspaces info
# Should list all workspaces without warnings
```

---

### Issue 2: React Dependencies Being Hoisted to Root

**Symptom**:

- React appears in root `node_modules`
- Multiple React instances causing "Invalid hook call" errors
- Different apps trying to use each other's React versions

**Cause**: Yarn v1 hoists dependencies to the root by default for deduplication.

**Solution**: Use `nohoist` configuration in the root `package.json`. In Yarn v1, `nohoist` must be inside the `workspaces` object, not at the root level.

**Root `package.json` configuration**:

```json
{
  "workspaces": {
    "packages": ["apps/*"],
    "nohoist": [
      "**/react",
      "**/react/**",
      "**/react-dom",
      "**/react-dom/**",
      "**/react-native",
      "**/react-native/**",
      "**/expo",
      "**/expo/**",
      "**/@expo/**",
      "**/@react-native/**",
      "**/@react-navigation/**",
      "**/react-native-gesture-handler",
      "**/react-native-reanimated",
      "**/react-native-safe-area-context",
      "**/react-native-screens",
      "**/react-native-web",
      "**/react-native-worklets",
      "**/use-sync-external-store",
      "**/use-sync-external-store/**",
      "web/**",
      "mobile/**"
    ]
  }
}
```

**Key Points**:

- `**/react` prevents React from being hoisted from any workspace
- `**/react/**` prevents all React-related packages
- `web/**` and `mobile/**` prevent ALL packages from those workspaces from being hoisted (more aggressive isolation)
- Include both the package name and `package/**` pattern for comprehensive coverage

**Verification**:

```bash
# Check root node_modules - React should NOT be there
ls node_modules | grep react
# Should only show utility packages like eslint-plugin-react, not react itself

# Check each app's node_modules - React SHOULD be there
ls apps/web/node_modules | grep "^react$"
ls apps/mobile/node_modules | grep "^react$"
```

---

### Issue 3: Nested React in Transitive Dependencies

**Symptom**:

- `use-sync-external-store` (or other packages) installing their own nested React
- Error: `Cannot read properties of null (reading 'useRef')`
- Multiple React instances in dependency tree

**Cause**: Transitive dependencies installing their own copies of React in nested `node_modules` directories.

**Solution**:

1. Add the problematic package to `nohoist` (e.g., `**/use-sync-external-store`)
2. Use workspace-specific `resolutions` to force correct React version
3. Add a `postinstall` script to clean up any nested React installations

**Root `package.json` postinstall script**:

```json
{
  "scripts": {
    "postinstall": "find . -path '*/node_modules/use-sync-external-store/node_modules/react' -type d -prune -exec rm -rf {} + 2>/dev/null || true"
  }
}
```

**Workspace-specific `resolutions`** (in each app's `package.json`):

For web app (`apps/web/package.json`):

```json
{
  "resolutions": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "use-sync-external-store/react": "19.2.0"
  }
}
```

For mobile app (`apps/mobile/package.json`):

```json
{
  "resolutions": {
    "react": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

**Important**:

- **DO NOT** put global React resolutions in the root `package.json` - this will force the same version across all workspaces
- Use workspace-specific `resolutions` only
- The `resolutions` field in Yarn v1 works at the workspace level

**Verification**:

```bash
# Check for nested React in use-sync-external-store
find . -path '*/node_modules/use-sync-external-store/node_modules/react' -type d
# Should return nothing after postinstall runs

# Check React versions in each app
cd apps/web && npm ls react
cd apps/mobile && npm ls react
# Each should show their respective React versions
```

---

### Issue 4: Global Resolutions Breaking Workspace Isolation

**Symptom**:

- All workspaces forced to use the same React version
- Error: `invalid: react@X.X.X` when checking dependencies
- One app works, the other breaks

**Cause**: `resolutions` in root `package.json` applies globally to all workspaces.

**Solution**:

- **Remove** global React resolutions from root `package.json`
- **Add** workspace-specific `resolutions` in each app's `package.json`
- Rely on `nohoist` for isolation, use `resolutions` only for forcing versions within each workspace

**Wrong** (root `package.json`):

```json
{
  "resolutions": {
    "**/react": "19.2.0" // ❌ This forces all workspaces to use 19.2.0
  }
}
```

**Correct** (workspace `package.json`):

```json
{
  "resolutions": {
    "react": "19.2.0" // ✅ This only applies to this workspace
  }
}
```

---

### Issue 5: Dependencies Not Installing in Workspace Directories

**Symptom**:

- Running `yarn install` from root doesn't install dependencies in workspace directories
- Workspace `node_modules` directories are empty or missing

**Cause**: This is actually **normal behavior** for Yarn v1 workspaces. Dependencies are installed in the root `node_modules` and workspaces resolve them from there via symlinks or module resolution.

**Solution**:

- With `nohoist` properly configured, dependencies will be installed in workspace `node_modules` for packages listed in `nohoist`
- Other dependencies will be in root `node_modules` but accessible to workspaces
- This is expected and correct behavior

**Verification**:

```bash
# Check if workspace can resolve its dependencies
cd apps/web
node -e "console.log(require.resolve('react'))"
# Should show path to React (either in workspace node_modules or root)
```

---

## Complete Working Configuration

### Root `package.json`

```json
{
  "name": "yarn-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": {
    "packages": ["apps/*"],
    "nohoist": [
      "**/react",
      "**/react/**",
      "**/react-dom",
      "**/react-dom/**",
      "**/react-native",
      "**/react-native/**",
      "**/expo",
      "**/expo/**",
      "**/@expo/**",
      "**/@react-native/**",
      "**/@react-navigation/**",
      "**/react-native-gesture-handler",
      "**/react-native-reanimated",
      "**/react-native-safe-area-context",
      "**/react-native-screens",
      "**/react-native-web",
      "**/react-native-worklets",
      "**/use-sync-external-store",
      "**/use-sync-external-store/**",
      "web/**",
      "mobile/**"
    ]
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "postinstall": "find . -path '*/node_modules/use-sync-external-store/node_modules/react' -type d -prune -exec rm -rf {} + 2>/dev/null || true"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### Web App `package.json` (apps/web/package.json)

```json
{
  "name": "web",
  "version": "0.0.1",
  "private": true,
  "resolutions": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "use-sync-external-store/react": "19.2.0"
  },
  "nohoist": ["react", "react-dom", "use-sync-external-store"],
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
    // ... other dependencies
  }
}
```

### Mobile App `package.json` (apps/mobile/package.json)

```json
{
  "name": "mobile",
  "version": "0.0.1",
  "private": true,
  "resolutions": {
    "react": "19.1.0",
    "react-native": "0.81.5"
  },
  "nohoist": ["react", "react-dom"],
  "dependencies": {
    "react": "19.1.0",
    "react-native": "0.81.5"
    // ... other dependencies
  }
}
```

---

## Clean Installation Process

When setting up or troubleshooting, follow this process:

```bash
# 1. Remove all node_modules
rm -rf node_modules apps/*/node_modules

# 2. Remove yarn.lock
rm -f yarn.lock

# 3. Install dependencies
yarn install

# 4. Verify nohoist is working
ls node_modules | grep "^react$"
# Should return nothing

# 5. Verify each workspace has its React
ls apps/web/node_modules | grep "^react$"
ls apps/mobile/node_modules | grep "^react$"
# Both should show "react"

# 6. Check for nested React in problematic packages
find . -path '*/node_modules/use-sync-external-store/node_modules/react' -type d
# Should return nothing (postinstall should have cleaned it up)

# 7. Verify React versions
cd apps/web && npm ls react | grep "react@"
cd apps/mobile && npm ls react | grep "react@"
# Should show correct versions for each app
```

---

## Key Takeaways

1. **Yarn v1 `nohoist` must be inside `workspaces` object**, not at root level
2. **Each workspace must have a `version` field** in its `package.json`
3. **Use workspace-specific `resolutions`**, not global ones in root
4. **Include both package name and `package/**`patterns** in`nohoist` for comprehensive coverage
5. **Add `postinstall` script** to clean up nested React installations
6. **Use `web/**`and`mobile/**` patterns** in `nohoist` for aggressive isolation if needed
7. **Always verify after installation** that React is not in root `node_modules` and is present in each workspace

---

## Debugging Commands

```bash
# List all workspaces
yarn workspaces info

# Check React location and version
npm ls react

# Find all React installations
find . -name "react" -type d | grep node_modules

# Check what's in root node_modules
ls node_modules | grep react

# Check workspace node_modules
ls apps/web/node_modules | head -20
ls apps/mobile/node_modules | head -20

# Verify module resolution
cd apps/web && node -e "console.log(require.resolve('react'))"
cd apps/mobile && node -e "console.log(require.resolve('react'))"
```

---

## Alternative Solutions

If `nohoist` continues to cause issues:

1. **Consider upgrading to Yarn 2+ (Berry)**: Better support for dependency isolation with `nohoist` in `.yarnrc.yml`
2. **Use pnpm**: Better native support for workspace isolation
3. **Use npm workspaces with `.npmrc`**: Can configure hoisting behavior

However, the configuration above should work for Yarn v1 if followed correctly.

---

## Common Error Messages and Fixes

| Error                            | Cause                              | Fix                                                      |
| -------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `Invalid hook call`              | Multiple React instances           | Add to `nohoist`, use `resolutions`, add `postinstall`   |
| `Missing version in workspace`   | No `version` field                 | Add `"version": "0.0.1"` to workspace `package.json`     |
| `invalid: react@X.X.X`           | Global resolutions forcing version | Remove from root, add to workspace-specific              |
| `Cannot read properties of null` | Nested React in transitive deps    | Add package to `nohoist`, add `postinstall` cleanup      |
| Workspace not found              | Missing `version` or wrong path    | Check `workspaces.packages` and workspace `package.json` |

---

## References

- [Yarn v1 Workspaces Documentation](https://classic.yarnpkg.com/en/docs/workspaces/)
- [Yarn v1 nohoist Documentation](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/)
