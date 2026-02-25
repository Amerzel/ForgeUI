# ForgeUI v1.0 Rollout Plan

Tracks the adoption of `@forgeui/*` packages across all 9 game dev tools.

**Prerequisites:** All packages at v1.0.0. See `THEME-EXTENSION.md` for the
migration guide and `docs/PLAN.md` for design decisions.

---

## Rollout Order

Ordered by complexity (simplest → largest surface area).

| # | Tool | Status | Notes |
|---|------|--------|-------|
| 1 | **PipelineInspector** | 🔲 | Pilot — establish patterns |
| 2 | **EntityArchitect** | 🔲 | PropertyGrid + TreeView heavy |
| 3 | **QuestForge** | 🔲 | Timeline + Steps usage |
| 4 | **EncounterComposer** | 🔲 | DataTable + CommandPalette |
| 5 | **AssetGenerator** | 🔲 | DropZone + ColorPicker |
| 6 | **Director** | 🔲 | Timeline + NodeEditor |
| 7 | **TerrainComposer** | 🔲 | VirtualCanvas + PropertyGrid |
| 8 | **LoreEngine** | 🔲 | Largest surface area — last |
| 9 | **Crucible** | 🔲 | Tokens only (`@forgeui/tokens`) |

---

## T17.1 — PipelineInspector Pilot

The pilot migration establishes patterns for subsequent tools.

### Pilot Goals
1. Validate token coverage (are there gaps in `--forge-*` tokens?)
2. Validate component coverage (anything missing from Phase 1–3?)
3. Identify common prop/event API friction
4. Measure bundle size impact in a real tool
5. Document any patterns specific to game dev tool UIs

### PipelineInspector Component Inventory

Expected components needed (to be confirmed during migration):

| PipelineInspector widget | ForgeUI equivalent |
|--------------------------|-------------------|
| App layout | `AppShell` (nav + sidebar + main) |
| Node graph canvas | `NodeEditor` (ReactFlow) |
| Property panel | `PropertyGrid` |
| File import dialog | `Dialog` + `DropZone` |
| Asset table | `DataTable` |
| Context menus | `ContextMenu` |
| Status toasts | `ToastProvider` + `ToastList` |
| Toolbar | `Toolbar` |
| Progress indicators | `Progress` + `Spinner` |
| Search | `CommandPalette` or `Input` with filter |

### Step-by-Step Pilot Plan

```
Week 1: Token migration
  [ ] Install @forgeui/tokens, @forgeui/components, @forgeui/hooks
  [ ] Add tokens.css import at app entry
  [ ] Wrap root with <ThemeProvider palette="hearth-bronze" mode="dark">
  [ ] Replace all :root hardcoded colors with var(--forge-*)
  [ ] Define PipelineInspectorExtensions in src/theme.ts

Week 2: Primitive swap
  [ ] Replace Button/IconButton instances
  [ ] Replace Input/Select/Checkbox/Slider/FormField
  [ ] Replace Badge/Card/Spinner/Text/Heading

Week 3: Overlay + feedback swap
  [ ] Replace dialogs with <Dialog>
  [ ] Replace tooltip implementations with <Tooltip>
  [ ] Replace dropdown menus with <DropdownMenu> / <ContextMenu>
  [ ] Replace alert system with <Alert> + <ToastProvider>

Week 4: Complex + domain swap
  [ ] Adopt <DataTable> for asset listing
  [ ] Adopt <PropertyGrid> for property panel
  [ ] Adopt <NodeEditor> for pipeline graph
  [ ] Adopt <AppShell> for layout
  [ ] Replace toolbar with <Toolbar>

Week 5: Polish + validation
  [ ] Run axe audit — target 0 violations
  [ ] Check bundle size (< 80 KB gzipped for ForgeUI portion)
  [ ] Document pain points
  [ ] Create PR with migration notes
```

### Known Gaps to Track

Document any ForgeUI gaps discovered during migration:

| Gap | Severity | Resolution |
|-----|----------|------------|
| (none yet) | — | — |

---

## Per-Tool Extension Token Namespaces

Each tool should namespace its extension tokens with a tool-specific prefix.
This prevents collisions when tools are eventually composed.

| Tool | Prefix | Example token |
|------|--------|---------------|
| PipelineInspector | `--pipe-` | `--pipe-node-active` |
| EntityArchitect | `--arch-` | `--arch-component-color` |
| QuestForge | `--quest-` | `--quest-stage-active` |
| EncounterComposer | `--enc-` | `--enc-enemy-hp` |
| AssetGenerator | `--asset-` | `--asset-tag-color` |
| Director | `--dir-` | `--dir-shot-color` |
| TerrainComposer | `--terrain-` | `--terrain-biome-color` |
| LoreEngine | `--lore-` | `--lore-faction-arcane` |
| Crucible | `--crucible-` | (tokens only, no components) |

---

## Shared Pattern Library

Patterns discovered during migration that benefit all tools:

### App Shell Pattern

```tsx
import { AppShell, Menubar, Toolbar } from '@forgeui/components'

function ToolApp() {
  return (
    <AppShell
      nav={<AppNav />}
      sidebar={<AppSidebar />}
    >
      <AppMain />
    </AppShell>
  )
}

function AppNav() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16, width: '100%' }}>
      <Menubar menus={FILE_MENUS} />
      <Toolbar aria-label="Main toolbar">
        <Toolbar.Button onClick={handleNew}>New</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button onClick={handleSave}>Save</Toolbar.Button>
      </Toolbar>
    </div>
  )
}
```

### Inspector Panel Pattern

```tsx
import { ResizablePanelGroup, ResizablePanel, PropertyGrid } from '@forgeui/components'

function EditorLayout() {
  return (
    <ResizablePanelGroup direction="horizontal" storageKey="editor-panels">
      <ResizablePanel defaultSize={240} minSize={180}>
        <Sidebar />
      </ResizablePanel>
      <ResizablePanel flex>
        <Canvas />
      </ResizablePanel>
      <ResizablePanel defaultSize={280} minSize={200}>
        <PropertyGrid sections={SECTIONS} values={values} onChange={handleChange} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Command Palette Pattern (⌘K)

```tsx
import { CommandPalette } from '@forgeui/components'
import { useEffect, useState } from 'react'

function ToolRoot() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <AppContent />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        groups={COMMAND_GROUPS}
      />
    </>
  )
}
```
