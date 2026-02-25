---
"@forgeui/components": major
"@forgeui/tokens": major
"@forgeui/icons": major
"@forgeui/hooks": major
---

v1.0.0 — Full component library, domain editors, typed theme extensions

## Summary

ForgeUI is now feature-complete across all 4 tracks:

- **43 core components** (Phases 1–2b) — primitives, forms, disclosure, feedback, overlays, composites, layout, complex inputs
- **3 domain editors** (Phase 3) — NodeEditor, Timeline, VirtualCanvas
- **Typed theme extensions** — ThemeContract<TExtensions> for tool-specific CSS custom properties
- **274 unit tests** — 0 failures, 0 axe violations (WCAG AA)

---

## @forgeui/components

### Phase 2a — Composites & Layout (13 components)
- `Drawer` — slide-in side panel (left/right/top/bottom), animated
- `Collapsible` — Radix Collapsible with chevron rotation
- `Toolbar` — compound (Toolbar.Button, .Separator, .ToggleGroup, .ToggleItem)
- `Steps` — step indicator with pending/active/completed/error states
- `Avatar` — Radix Avatar, 5 sizes, initials fallback
- `AspectRatio` — Radix AspectRatio wrapper
- `Breadcrumb` — nav with aria-current=page on last item
- `Menubar` — Radix Menubar, shared MenuEntry types
- `Table` — compound (Table.Header/.Body/.Row/.Head/.Cell), sortable columns
- `AppShell` — CSS grid layout (nav/sidebar/main), 100dvh
- `ResizablePanelGroup` + `ResizablePanel` — drag resize with localStorage persistence
- `DropZone` — file drop with MIME/extension/size validation
- `Pagination` — ellipsis, page size selector

### Phase 2b — Complex Inputs (8 components)
- `DataTable` — TanStack Table v8 + Virtual; sorting, filtering, column resize, row selection, pagination, virtualization
- `CommandPalette` — cmdk + Radix Dialog; fuzzy search, grouped items, keyboard-first
- `TreeView` — recursive nodes, keyboard navigation, multi-select
- `Combobox` — cmdk-based autocomplete with filtering
- `ColorPicker` — 2D saturation/brightness picker, hue + alpha sliders, hex input, swatches
- `TagsInput` — Enter/comma/Tab to add, backspace to remove, suggestions
- `PropertyGrid` — typed editors (text/number/color/boolean/select/vec2/vec3), collapsible sections
- `EditableText` — inline edit on click/Enter, commit/cancel

### Phase 3 — Domain Editors (3 components)
- `NodeEditor` — @xyflow/react with ForgeUI token theming; dot grid, minimap, controls
- `Timeline` — horizontal multi-track clip editor; ruler, playhead scrubbing, clip drag/resize
- `VirtualCanvas` — infinite pannable/zoomable canvas; grid overlay, item drag, zoom indicator

---

## @forgeui/hooks

### ThemeContract<TExtensions>
- Generic `ThemeContract<TExtensions>` type alias for typed extension token interfaces
- `useTheme<T>()` and `useTokens<T>()` now accept type parameter
- `useTheme()` now returns `extensions` (previously only available via useTokens)

---

## Migration

See [`docs/THEME-EXTENSION.md`](../docs/THEME-EXTENSION.md) for:
- LoreEngine extension example with typed contract
- CSS custom property usage
- Canvas/WebGL typed token access
- Full migration guide for all 9 tools (token mapping, component swap list, checklist)
