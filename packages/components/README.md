# @forgeui/components

59 React 19 components for game development tooling. Built on Radix Primitives with ForgeUI design tokens.

## Requirements

- React 19+

## Installation

```bash
npm install @forgeui/components @forgeui/tokens
```

## Setup

Import the CSS files once at your app root:

```ts
import '@forgeui/tokens/tokens.css'
import '@forgeui/components/styles/base.css'
```

Wrap your app in `ThemeProvider`:

```tsx
import { ThemeProvider } from '@forgeui/components'

export function App() {
  return (
    <ThemeProvider palette="midnight-forge-v2" mode="dark">
      <YourApp />
    </ThemeProvider>
  )
}
```

## Usage

```tsx
// Barrel import (convenient; tree-shaking relies on bundler)
import { Button, Input, Dialog } from '@forgeui/components'

// Deep import (CSS-optimal — pulls only that component's styles)
import { Button } from '@forgeui/components/Button'
```

## ThemeProvider

```tsx
<ThemeProvider
  palette="midnight-forge-v2"  // 'midnight-forge-v2' | 'hearth-bronze' | 'midnight-forge' | 'deep-space'
  mode="dark"              // 'dark' | 'light'
  extensions={{}}          // optional tool-specific token extensions
>
```

Defaults: `palette="midnight-forge-v2"`, `mode="dark"`.

| Palette | Accent | Character |
|---------|--------|-----------|
| `midnight-forge-v2` | Gold `#f59e0b` | Navy/gold (default) |
| `hearth-bronze` | Amber `#d97706` | Warm forge workshop |
| `midnight-forge` | Blue `#4f8ff7` | Cool navy |
| `deep-space` | Teal `#14b8a6` | Deep navy |

### Tool-specific token extensions

Tools can inject domain-specific CSS custom properties via `extensions`:

```tsx
<ThemeProvider
  palette="midnight-forge-v2"
  mode="dark"
  extensions={{ prophecy: '#c084fc', factionPrimary: '#38bdf8' }}
>
  {/* --lore-prophecy and --lore-faction-primary are now available as CSS vars */}
</ThemeProvider>
```

See [THEME-EXTENSION.md](../../docs/THEME-EXTENSION.md) for the full typed extension pattern.

## Component inventory

### Primitives (13)

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, danger variants; loading state; `asChild` |
| `IconButton` | Accessible icon-only button; requires `label` for screen readers |
| `Badge` | Status indicators; solid, subtle, outline variants |
| `Text` | Inline/block text with size, weight, color, truncate props |
| `Heading` | Semantic h1–h6; `level` controls element, `size` controls visual scale |
| `Separator` | Horizontal/vertical divider |
| `Card` | Surface container; `Card.Header`, `Card.Body`, `Card.Footer` |
| `Kbd` | Keyboard shortcut display — `⌘+S` |
| `ScrollArea` | Custom-styled scrollbar; preserves native scroll behavior |
| `Label` | Accessible form label |
| `VisuallyHidden` | Screen-reader-only content |
| `Spinner` | Loading indicator with accessible live region |
| `AlertDialog` | Blocking confirmation dialog for destructive actions |

### Forms (11)

| Component | Description |
|-----------|-------------|
| `Input` | Text input; adornments, clear button, error state |
| `Textarea` | Auto-growing textarea |
| `Select` | Accessible dropdown; keyboard navigable |
| `Checkbox` | With indeterminate state |
| `Switch` | Toggle for boolean settings |
| `RadioGroup` | Horizontal or vertical radio group |
| `Slider` | Range slider with accent-colored track |
| `Toggle` | Two-state button (bold/italic, view modes) |
| `ToggleGroup` | Single or multiple selection (toolbars, alignment) |
| `FormField` | Composes Label + input slot + error + hint |
| `NumberInput` | Stepper buttons + drag-to-scrub interaction |

### Disclosure (2)

| Component | Description |
|-----------|-------------|
| `Accordion` | Collapsible sections; single or multiple open |
| `Tabs` | Tabbed panels; horizontal or vertical |

### Feedback (4)

| Component | Description |
|-----------|-------------|
| `Alert` | Status banner; info/success/warning/error variants |
| `Progress` | Linear progress bar; determinate or indeterminate |
| `Skeleton` | Loading placeholder with shimmer |
| `Toast` / `ToastList` | Stackable auto-dismiss notifications |

### Overlays (5)

| Component | Description |
|-----------|-------------|
| `Dialog` | Modal with focus trap and scroll lock |
| `Tooltip` | Hover/focus info tooltip |
| `DropdownMenu` | Keyboard-navigable action menu |
| `ContextMenu` | Right-click menu with submenus and checkable items |
| `Popover` | Anchored floating panel |

### Composites & Layout (13)

| Component | Description |
|-----------|-------------|
| `Drawer` | Slide-in panel from any edge |
| `Toolbar` | Grouped controls with roving keyboard focus |
| `ResizablePanelGroup` | Draggable resize panels; sizes persisted to localStorage |
| `Collapsible` | Animated show/hide for a single content region |
| `Menubar` | Desktop-style horizontal menu bar (File/Edit/View) |
| `Steps` | Multi-step wizard indicator |
| `Avatar` | User/entity image with fallback initials |
| `AspectRatio` | Constrain child to a fixed aspect ratio |
| `Table` | Semantic table with compound sub-components |
| `Breadcrumb` | Navigation trail with current-page indicator |
| `AppShell` | Root layout (Sidebar + Nav + Main) |
| `DropZone` | Drag-and-drop file upload area |
| `Pagination` | Page navigation controls |

### Complex Inputs & Data (8)

| Component | Description |
|-----------|-------------|
| `DataTable` | TanStack Table v8; sorting, filtering, column resize, virtualization for 10k+ rows |
| `CommandPalette` | `⌘K` fuzzy search; keyboard-first navigation |
| `TreeView` | Hierarchical data with keyboard navigation; scene graphs, entity trees, file trees |
| `Combobox` | Searchable select for large lists; autocomplete with filtering |
| `ColorPicker` | HSL/RGB/Hex; saturation picker, hue/alpha sliders, swatch grid, eyeDropper |
| `TagsInput` | Multi-tag entry with pill chips; keyboard focus management |
| `PropertyGrid` | Inspector-style typed key-value editor with collapsible sections |
| `EditableText` | Inline rename — static text that activates an input on click/Enter |

### Domain-Specific (3)

| Component | Description |
|-----------|-------------|
| `NodeEditor` | Visual node graph via `@xyflow/react`; ports, connections, pan/zoom, minimap |
| `Timeline` | Time-based track editor; clips, playhead, drag/resize, zoom |
| `VirtualCanvas` | Infinite pannable/zoomable canvas; grid, item selection and drag |

## Examples

### Button

```tsx
<Button variant="primary" onClick={handleSave}>Save Entity</Button>
<Button variant="danger" loading={isDeleting} onClick={handleDelete}>Delete</Button>
<Button variant="ghost" size="sm" startIcon={<PlusIcon size={16} />}>Add Component</Button>

// asChild — renders <a> with Button styles
<Button variant="secondary" asChild>
  <a href="/export">Export</a>
</Button>
```

### FormField + Input

```tsx
<FormField label="Entity Name" error={errors.name} hint="Used as the display name" required>
  <Input
    value={name}
    onChange={e => setName(e.target.value)}
    error={!!errors.name}
    placeholder="e.g. Goblin Chief"
  />
</FormField>
```

### Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Export Assets</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Confirm Export</Dialog.Header>
    <p>Export 42 assets to the output directory?</p>
    <Dialog.Footer>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleExport}>Export</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

### DataTable

```tsx
import { DataTable } from '@forgeui/components'
import type { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<Entity>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'status', header: 'Status' },
]

<DataTable columns={columns} data={entities} sorting filtering />
```

### AppShell

```tsx
<AppShell
  sidebar={<EntityTree />}
  nav={<Menubar ... />}
>
  <Inspector />
</AppShell>
```

### CommandPalette

```tsx
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  placeholder="Search entities, assets, commands..."
  items={[
    {
      group: 'Entities',
      items: entities.map(e => ({
        label: e.name,
        icon: <EntityIcon size={16} />,
        action: () => selectEntity(e.id),
      })),
    },
  ]}
/>
```

## Compound components

Several components expose dot-notation sub-components for structured composition:

```tsx
<Card>
  <Card.Header>Material Inspector</Card.Header>
  <Card.Body><PropertyGrid ... /></Card.Body>
  <Card.Footer><Button>Apply</Button></Card.Footer>
</Card>

<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Type</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>GoblinChief</Table.Cell>
      <Table.Cell>Enemy</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## asChild

Primitives that render a semantic HTML element support `asChild`. When `true`, the component merges its styles and behavior onto its single child instead of rendering its own DOM node:

```tsx
// Renders <a> with Button styles and behavior
<Button variant="primary" asChild>
  <a href="/docs">Documentation</a>
</Button>

// Renders <h2> with Heading styles
<Heading level={2} asChild>
  <h2>Scene Graph</h2>
</Heading>
```

## Accessibility

All components meet WCAG 2.1 AA:
- Full keyboard navigation on all interactive components
- Screen reader labels via Radix primitives
- Color-independent status indicators — icon + text label, never color alone
- `prefers-reduced-motion` — all animations disabled when requested
- `forced-colors: active` — functional in Windows High Contrast Mode
