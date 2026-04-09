# task-manager-shared

Shared TypeScript package for the Task Manager app. Published to GitHub Packages as `@noctilumina/task-manager-shared`.

Contains all business logic, types, repository interfaces, Firebase implementations, and services used by the mobile and desktop apps.

## What's in here

| Path | Purpose |
|------|---------|
| `src/types/` | `Task`, `CalendarEvent`, `User` interfaces |
| `src/repositories/` | `ITaskRepository` interface + `FirebaseTaskRepository`, `MockTaskRepository` implementations |
| `src/services/taskService.ts` | Create, read, update, delete, sort tasks |
| `src/services/syncService.ts` | Bidirectional offline sync with conflict resolution |
| `src/services/calendarService.ts` | Webhook bridge to N8N for calendar push |
| `src/utils/syncUtils.ts` | `resolveConflict`, `generateSyncId` |

## Setup (contributors)

**Prerequisites:** Node.js 18+, Yarn

```powershell
cd C:\Users\irisp\task-manager-shared
yarn install
yarn test        # run all tests
yarn build       # compile to dist/
```

## Publishing

Publishing is automatic via GitHub Actions on every push to `main`. The workflow runs tests then publishes `@noctilumina/task-manager-shared` to GitHub Packages.

To publish manually:
```powershell
yarn build
npm publish
```

Requires a GitHub Personal Access Token with `write:packages` scope set as `GITHUB_TOKEN` in your environment.

## Installing in another repo

Add `.npmrc` to the consuming repo:
```
@noctilumina:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:
```powershell
yarn add @noctilumina/task-manager-shared
```

Your `GITHUB_TOKEN` environment variable must be a GitHub Personal Access Token with `read:packages` scope.
