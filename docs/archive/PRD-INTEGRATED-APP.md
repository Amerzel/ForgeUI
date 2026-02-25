> **Archived:** This document is historical and no longer actively maintained.

# PRD: Single UI App — Integrated Architecture

**Status:** Proposal (for discussion)
**Last updated:** 2026-02-25
**Authors:** ForgeUI team

---

## 1. Background & Problem Statement

The game dev toolchain currently consists of 9 tools, most of which are CLI-first. Two tools — **LoreEngine** and **AssetGenerator** — have rich React UIs. As the toolchain grows, the friction of context-switching between separate apps increases. A world builder working in LoreEngine should not have to open a separate terminal or app to run an asset generation pipeline, inspect a build, or check faction relationships.

The **Integrated App** approach builds a single React SPA that houses all tool UIs under one roof. Tools are not isolated — they share state, routing, and data freely. The app behaves like a unified workstation: one window, one mental model, deep cross-tool awareness.

This document describes what that architecture would look like, what it enables, what it costs, and what questions remain open.

---

## 2. Goals

- **G1:** Eliminate context-switching between tools — everything is in one window
- **G2:** Enable cross-tool workflows (e.g., a lore entity surfaces in the asset pipeline)
- **G3:** Provide a single consistent design language and interaction model across all tools
- **G4:** Reduce per-tool boilerplate — shared layout, navigation, state, and auth all live once
- **G5:** Make it possible to surface CLI tool output and status inline without leaving the app

---

## 3. Non-Goals

- This is **not** an Electron wrapper — the app targets the browser (or Tauri if needed later)
- This is **not** a replacement for CLI tools — CLIs remain the primary execution engine; the UI is a frontend layer on top of them
- This is **not** a multi-tenant or team product — designed for solo or small-team use
- This does **not** need to be offline-first in v1

---

## 4. User Persona

**Primary user:** A solo game developer who owns the full toolchain. They design lore, generate assets, run pipelines, and inspect builds — often in the same work session.

Pain points today:
- Switching between multiple terminals, scripts, and standalone apps breaks flow
- No way to see "the state of the whole project" at a glance
- Repetitive configuration across tools (e.g., project path, palette, active world)

---

## 5. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                  Single React SPA                    │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │              AppShell (ForgeUI)                 │ │
│  │  Navigation · Toolbar · Toasts · ThemeProvider  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │LoreEngine│ │AssetGen  │ │Pipeline  │ │Settings│  │
│  │  (view)  │ │  (view)  │ │Inspector │ │ (view) │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Shared State (Zustand / Context)   │ │
│  │   activeProject · activeWorld · CLI output      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 5.1 Routing

React Router (or TanStack Router) provides top-level routing between tools. Each tool is a route subtree:

```
/                         → Home / Dashboard
/lore-engine              → LoreEngine root
/lore-engine/worlds/:id   → World detail
/lore-engine/entities/:id → Entity editor
/asset-generator          → AssetGenerator root
/pipeline                 → PipelineInspector
/settings                 → Global settings
```

Deep links work out of the box — sharing a URL opens the exact view.

### 5.2 State Management

A single global store manages cross-cutting state:

| Slice | Contents |
|---|---|
| `project` | Active project path, name, last opened |
| `world` | Active LoreEngine world — available to all tools |
| `pipeline` | Last pipeline run status, log tail |
| `ui` | Sidebar collapsed, active panel, theme overrides |
| `notifications` | Toast queue, background job status |

Each tool may have its own local state for UI-only concerns (selected row, scroll position), but business data flows through the global store so any view can read it.

### 5.3 Cross-Tool Data Flow Example

```
LoreEngine: user selects "Ironback Clan" faction
  → writes { activeWorld, activeFaction: 'ironback-clan' } to global store
    → AssetGenerator sidebar shows "Faction Assets: Ironback Clan"
      → clicking launches AssetGenerator filtered to that faction
    → PipelineInspector highlights recent builds tagged 'ironback-clan'
```

This kind of contextual awareness is only possible because tools share state directly.

### 5.4 CLI Integration

CLI tools (PipelineInspector, build scripts, etc.) are invoked via a thin local server (e.g., a small Express or Hono process that the app starts, or a Tauri sidecar). The UI streams stdout/stderr through WebSocket or SSE into the shared notification/log system.

---

## 6. Key Features

### 6.1 Unified Navigation
- ForgeUI `AppShell` provides the outer chrome: sidebar nav, top toolbar, breadcrumb
- No separate per-tool chrome to configure — each tool renders into a shared slot
- Keyboard shortcuts are global (`Cmd+K` command palette across all tools)

### 6.2 Cross-Tool Awareness
- "Context bar" at top of every view shows active project, active world, last pipeline status
- Entities, factions, and assets created in one tool can be browsed from another
- Global search indexes content from all tools

### 6.3 Integrated CLI Output
- Every CLI invocation surfaces in a shared "Output" panel (like VS Code's terminal panel)
- Build errors link directly to the relevant tool view

### 6.4 Single Settings Surface
- Theme, project path, keybindings, and per-tool config all in one Settings view
- No per-tool config files scattered across the filesystem (or they are managed from here)

---

## 7. Development Experience

### 7.1 Repository Structure
```
apps/
  workstation/          ← the integrated app
    src/
      views/
        lore-engine/    ← LoreEngine views
        asset-gen/      ← AssetGenerator views
        pipeline/       ← PipelineInspector UI
        settings/       ← Settings
      store/            ← Zustand global store
      shell/            ← AppShell, navigation, routing
    package.json
```

### 7.2 Workflow
- One `pnpm dev` starts the whole app
- One `pnpm test` runs all tests (single Vitest config)
- One Storybook covers all components + views
- No inter-package version coordination needed — no package boundaries within the app

---

## 8. Tradeoffs

### Advantages

| Advantage | Detail |
|---|---|
| Simplest mental model | One app, one router, one store — no protocol between parts |
| Richest cross-tool UX | Shared state enables contextual awareness that is hard to retrofit |
| Fastest to build v1 | No framework/module infrastructure to design upfront |
| Easy refactoring | Moving code between tools is a file move, not a package change |
| Single deploy | One build artifact, one version, one URL |

### Disadvantages

| Disadvantage | Detail |
|---|---|
| Coupling risk | A bug in one tool's state slice can affect all tools |
| Scaling teams | If more than one person works in this codebase, merge conflicts increase |
| Bundle size | All tools load upfront unless aggressive code-splitting is applied manually |
| Hard to isolate | Testing one tool in isolation requires mocking the global store |
| Migration risk | LoreEngine and AssetGenerator have existing codebases — integrating them means a larger rewrite |

---

## 9. Migration Path

The integrated approach requires either:

**Option A: Big bang rewrite**
- Port LoreEngine and AssetGenerator views into the new app all at once
- High risk, long runway before value

**Option B: Strangler fig**
- Ship the shell + one tool first (LoreEngine, as the most complex UI)
- Embed the other tools as iframes temporarily, replace with native views over time
- Lower risk but the iframe phase produces a suboptimal UX

---

## 10. Open Questions

1. **Who owns the global store schema?** If LoreEngine adds a field, does that affect all other tools? How do we prevent accidental coupling?
2. **How does the CLI integration layer work?** Does the app need a local sidecar process? Does that create a distribution/install dependency?
3. **How do we handle LoreEngine's existing codebase?** It is a full React SPA today. Is the rewrite cost justified?
4. **What is the v1 scope?** Can we ship with only LoreEngine + shell and defer the rest?
5. **How does deep linking interact with desktop vs. browser deployment?**

---

## 11. Success Metrics

- User can complete a cross-tool workflow (create entity → generate asset → inspect pipeline) without leaving the app window
- Cold start time < 2s on a modern machine
- No tool view is "orphaned" — all 9 tools have at least a status/output surface in v1
- ForgeUI component coverage: 100% of new UI uses ForgeUI components (no raw HTML, no Tailwind)
