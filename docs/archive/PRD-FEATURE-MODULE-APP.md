> **Archived:** This document is historical.

> **Archived:** This document is historical and no longer actively maintained.

# PRD: Single UI App — Feature Module Architecture

**Status:** Proposal (for discussion)
**Last updated:** 2026-02-25
**Authors:** ForgeUI team

---

## 1. Background & Problem Statement

The game dev toolchain consists of 9 tools — mostly CLI, with LoreEngine and AssetGenerator as the primary UI apps. As the toolchain grows, there is a natural desire to bring these UIs under one roof without sacrificing the independence that makes each tool maintainable.

The **Feature Module** approach builds a single React SPA with a well-defined shell and independently developed feature modules. Each tool's UI lives in an isolated module with clear API boundaries. Modules are loaded into the same app but cannot reach into each other's internals — they communicate through a defined event bus or service layer.

The result is a unified user experience with a federated development model: one app to the user, independent units to the developer.

---

## 2. Goals

- **G1:** Unified user experience — one app, one design system, one navigation model
- **G2:** Isolation by default — a bug or rewrite in one module cannot break another
- **G3:** Independent development cadence — modules can be built, tested, and updated separately
- **G4:** Incremental migration — LoreEngine and AssetGenerator can be ported one module at a time
- **G5:** Clear contracts between tools — cross-tool communication happens through defined interfaces, not shared mutable state
- **G6:** Ability to ship a module as a standalone app in the future if needed, without rearchitecting

---

## 3. Non-Goals

- This is **not** a micro-frontend system — modules are not separately deployed; they share a bundle and a runtime
- This is **not** a plugin marketplace — modules are first-party and live in the same monorepo
- This does **not** require a module registry or dynamic loading infrastructure in v1 (static imports are fine)
- This is **not** designed for multi-tenancy or team-level isolation

---

## 4. User Persona

**Primary user:** A solo game developer who owns the full toolchain. They design lore, generate assets, run pipelines, and inspect builds — often in the same work session.

**Secondary stakeholder:** Future contributors or collaborators who may own a single tool and should not need to understand the whole codebase to work on it.

Pain points today:
- Context-switching between separate apps and terminals breaks flow
- No unified "home" for the toolchain
- LoreEngine and AssetGenerator have separate, inconsistent UIs

---

## 5. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      Single React SPA                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                   App Shell                          │    │
│  │   Routing · Navigation · ThemeProvider · EventBus   │    │
│  └──────────────────────────────────────────────────────┘    │
│            │              │              │                   │
│  ┌─────────▼──┐  ┌────────▼──┐  ┌───────▼────┐             │
│  │  Module:   │  │  Module:  │  │  Module:   │  ...        │
│  │ LoreEngine │  │ AssetGen  │  │ Pipeline   │             │
│  │            │  │           │  │ Inspector  │             │
│  │ ┌────────┐ │  │ ┌───────┐ │  │ ┌────────┐ │             │
│  │ │ Views  │ │  │ │ Views │ │  │ │ Views  │ │             │
│  │ │ State  │ │  │ │ State │ │  │ │ State  │ │             │
│  │ │ Services│ │  │ │Srvcs  │ │  │ │Srvcs   │ │             │
│  │ └────────┘ │  │ └───────┘ │  │ └────────┘ │             │
│  │  [public   │  │  [public  │  │  [public   │             │
│  │   API]     │  │   API]    │  │   API]     │             │
│  └────────────┘  └───────────┘  └────────────┘             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Shared Services Layer                   │    │
│  │   EventBus · ProjectContext · CLI Bridge · Logger    │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 5.1 The Shell

The shell is thin by design. It owns:
- The router and top-level route definitions
- The `AppShell` chrome (sidebar, toolbar, breadcrumb) from ForgeUI
- The `ThemeProvider` and global CSS
- The `EventBus` instance
- Navigation between modules

The shell **does not** own any business logic. It knows that modules exist and how to route to them — nothing more.

### 5.2 Modules

Each tool is a feature module. A module is a self-contained directory that:
- Owns its own views, state, and services
- Exports a single `ModuleConfig` (routes, nav entries, event handlers)
- Does **not** import from other modules directly

```typescript
// Example: LoreEngine module config
export const LoreEngineModule: ModuleConfig = {
  id: 'lore-engine',
  nav: { label: 'Lore Engine', icon: BookIcon, path: '/lore-engine' },
  routes: [
    { path: '/lore-engine',            element: <LoreEngineDashboard /> },
    { path: '/lore-engine/worlds/:id', element: <WorldEditor /> },
    { path: '/lore-engine/entities',   element: <EntityBrowser /> },
  ],
  // Events this module emits (for other modules to subscribe to)
  emits: ['lore:entity-selected', 'lore:world-changed'],
  // Events this module listens to
  listens: ['project:changed', 'pipeline:build-complete'],
}
```

### 5.3 The EventBus (Cross-Module Communication)

Modules talk to each other through typed events, never through direct imports:

```typescript
// LoreEngine emits when the user selects a faction
eventBus.emit('lore:entity-selected', {
  type: 'faction',
  id: 'ironback-clan',
  name: 'Ironback Clan',
})

// AssetGenerator listens and updates its filter
eventBus.on('lore:entity-selected', (entity) => {
  if (entity.type === 'faction') {
    assetStore.setFactionFilter(entity.id)
  }
})
```

This creates an **audit trail of cross-module dependencies**: the event schema is the contract. When a module changes, you know exactly what it broadcasts and what it consumes.

### 5.4 Shared Services Layer

Infrastructure that all modules can use is provided through a shared services layer — not through global state:

| Service | Responsibility |
|---|---|
| `ProjectContext` | Active project path, last-opened world, metadata |
| `CLIBridge` | Invoke CLI tools, stream stdout/stderr to the logger |
| `Logger` | Structured log stream; modules write, shell renders |
| `EventBus` | Typed event pub/sub between modules |
| `NotificationService` | Toast/alert queue rendered by the shell |

Modules receive these services via React Context or dependency injection — they do not import from each other.

### 5.5 Routing

```
/                         → Shell home / project dashboard
/lore-engine/**           → LoreEngine module owns this subtree
/asset-generator/**       → AssetGenerator module owns this subtree
/pipeline/**              → PipelineInspector module owns this subtree
/settings                 → Shell-level settings
```

Modules register their routes declaratively in their `ModuleConfig`. The shell assembles the router at startup from the registered module configs. Adding a new module is: create the module, register it — no shell code changes.

---

## 6. Module Contract (Public API)

Each module exports exactly one public API object. All internal implementation is private:

```typescript
// modules/lore-engine/index.ts  ← public API
export { LoreEngineModule } from './module.config'
export type { LoreEntitySelectedEvent, LoreWorldChangedEvent } from './events'

// Everything else in modules/lore-engine/ is an implementation detail
```

This enforces encapsulation at the file level — if another module tries to import from `modules/lore-engine/views/WorldEditor`, that is a linting violation.

An ESLint rule (e.g., `import/no-internal-modules` scoped to `modules/`) can enforce this automatically.

---

## 7. Repository Structure

```
apps/
  workstation/
    src/
      shell/
        AppShell.tsx
        router.tsx         ← assembles routes from ModuleConfigs
        navigation.tsx     ← assembles nav from ModuleConfigs
        eventBus.ts
      services/
        ProjectContext.tsx
        CLIBridge.ts
        Logger.ts
        NotificationService.ts
      modules/
        lore-engine/       ← self-contained module
          index.ts         ← public API only
          module.config.tsx
          views/
          state/
          services/
          __tests__/
        asset-generator/
          index.ts
          module.config.tsx
          ...
        pipeline-inspector/
          index.ts
          module.config.tsx
          ...
      main.tsx             ← registers modules, renders shell
    package.json
```

---

## 8. Development Experience

### 8.1 Working on a Module in Isolation

A module can be developed and tested without running the full app:

```bash
# Run only the LoreEngine module with a mock shell
pnpm dev --module lore-engine

# Test only LoreEngine
pnpm test modules/lore-engine
```

Each module gets a lightweight test harness that provides mock services (mock EventBus, mock ProjectContext) so tests never need the real shell.

### 8.2 Adding a New Module

1. Create `modules/my-tool/` directory
2. Implement views, state, services
3. Export a `ModuleConfig` from `index.ts`
4. Register it in `main.tsx`:
   ```typescript
   registerModules([LoreEngineModule, AssetGeneratorModule, MyToolModule])
   ```
5. Done — the shell auto-discovers routes and nav entries

No changes to shell code, no changes to other modules.

### 8.3 Migrating an Existing App

LoreEngine and AssetGenerator can be migrated incrementally:

**Phase 1:** Create the module scaffold. Register it with the shell. The module renders an iframe to the existing app temporarily.

**Phase 2:** Port views one at a time into the module, replacing iframe sections as they're ready.

**Phase 3:** Remove the iframe. Module is fully native.

At no point does the existing app need to be taken offline or frozen.

---

## 9. Tradeoffs

### Advantages

| Advantage | Detail |
|---|---|
| Isolation by default | A module crash cannot destabilize other modules (with an ErrorBoundary per module) |
| Independent testability | Mock the EventBus and services — test a module in total isolation |
| Clear ownership | "Who owns this?" is answered by which module directory it's in |
| Safe incremental migration | Iframe → native transition keeps existing apps running during migration |
| Extensible | New tools are a new module, not a modification to existing code |
| Future flexibility | A module could be extracted into a standalone app without rearchitecting its internals |

### Disadvantages

| Disadvantage | Detail |
|---|---|
| More upfront design | The EventBus schema, ModuleConfig contract, and service interfaces must be designed before building modules |
| Event schema maintenance | If a module changes what it emits, dependent modules must be updated — the EventBus is a soft contract |
| Indirect communication | Cross-module workflows that require tight feedback loops (e.g., real-time sync) are harder with events than shared state |
| Potential over-engineering | If the project stays solo and small, the module boundaries may never provide payoff |
| More boilerplate per module | Each module needs index.ts, module.config.tsx, mock service setup for tests |

---

## 10. Comparison: Where This Wins and Loses vs. Integrated

| Dimension | Integrated | Feature Module |
|---|---|---|
| Cross-tool UX depth | Higher (shared state, any view sees all data) | Moderate (event-driven, slightly delayed awareness) |
| Isolation / bug containment | Lower | Higher |
| Initial build speed | Faster | Slower (framework cost upfront) |
| Scalability to more contributors | Harder | Easier |
| Incremental migration | Harder (big bang or iframe hack) | Easier (iframe phase is legitimate) |
| Testability of individual tools | Harder (must mock global store) | Easier (mock services, isolated test run) |
| Conceptual overhead | Low | Medium |

---

## 11. Open Questions

1. **What is the right EventBus schema governance model?** Who approves new event types? How are breaking changes to event schemas handled?
2. **How granular should modules be?** Is `lore-engine` one module or should `WorldEditor`, `EntityBrowser`, etc. be separate modules?
3. **Does the iframe migration phase create a poor UX?** If LoreEngine in an iframe looks/feels different, does that hurt the rollout?
4. **What service does the CLIBridge depend on?** Does it require a local sidecar process, or can it use something like `child_process` via Tauri/Electron? This is a platform constraint, not an architecture constraint.
5. **Is lazy loading required in v1?** With 3 modules and a modern bundler, the initial bundle may be small enough that lazy loading is a premature optimization.
6. **What is the right module granularity for PipelineInspector?** It is largely a CLI with minimal UI — should it be a module with a small surface (log viewer, build status) rather than a full module?

---

## 12. Migration Path

### v0: Shell Only
- Build the AppShell with ForgeUI
- Register placeholder routes for all 9 tools (most show "CLI only — run `forge pipeline inspect`")
- LoreEngine and AssetGenerator get iframe modules pointing to their current apps

### v1: LoreEngine Module (Native)
- Port LoreEngine views into the module architecture
- Define and emit the first events (`lore:world-changed`, `lore:entity-selected`)
- Validate the module contract works in practice

### v2: AssetGenerator Module (Native)
- Port AssetGenerator, subscribe to LoreEngine events
- Cross-tool workflow: select faction in LoreEngine → AssetGenerator filters by faction

### v3+: Remaining Tools
- Each CLI tool gets at minimum a status/output surface (log viewer, last run status)
- Full UI modules added as needed

---

## 13. Success Metrics

- A new module can be created and registered in under 1 hour without modifying shell or other modules
- Each module's test suite runs in isolation (no inter-module imports in test files)
- A user can navigate between all tool UIs without a page reload
- ForgeUI component coverage: 100% of new UI uses ForgeUI components
- Cross-tool event latency < 50ms (user action in Module A → Module B reacts)
