# ForgeUI Agent Guide

> **For AI agents and LLMs using ForgeUI in game dev tooling.**
> This document is the authoritative quick-reference for all available components,
> their key props, usage patterns, and project conventions. Read this before writing
> any UI code with ForgeUI.

---

## Table of Contents

1. [Setup & Installation](#1-setup--installation)
2. [Design System Conventions](#2-design-system-conventions)
3. [Layout Primitives](#3-layout-primitives)
4. [Primitive Components](#4-primitive-components)
5. [Form Components](#5-form-components)
6. [Disclosure Components](#6-disclosure-components)
7. [Feedback Components](#7-feedback-components)
8. [Overlay Components](#8-overlay-components)
9. [Composite Components](#9-composite-components)
10. [Complex / Data Components](#10-complex--data-components)
11. [Domain-Specific Components](#11-domain-specific-components)
12. [Common Patterns](#12-common-patterns)
13. [Requesting a Component](#13-requesting-a-component)
14. [Reporting a Bug](#14-reporting-a-bug)

---

## 1. Setup & Installation

```bash
pnpm add @forgeui/components @forgeui/tokens
```

Wrap your app root once with `ThemeProvider`. All components must be descendants of it.

```tsx
import { ThemeProvider } from '@forgeui/components'
import '@forgeui/tokens/tokens.css'

function App() {
  return (
    <ThemeProvider palette="hearth-bronze" mode="dark">
      <YourApp />
    </ThemeProvider>
  )
}
```

**Palettes:** `hearth-bronze` (default) · `midnight-forge` · `deep-space` · `midnight-forge-v2`
**Modes:** `dark` (default) · `light`

---

## 2. Design System Conventions

### 2.1 Token-aware shorthand props

Layout primitives accept shorthand props that resolve to CSS custom properties. Never write raw pixel values for spacing — use the scale.

```tsx
// ✅ Do this
<Box p={4} gap={2} bg="surface" radius="md" />

// ❌ Not this
<div style={{ padding: 16, background: '#1a1a1a', borderRadius: 6 }} />
```

**Spacing scale** (maps to `var(--forge-space-N)`):

| Prop value | CSS output | Pixels (approx) |
|---|---|---|
| `0` | `0` | 0 |
| `0.5` | `var(--forge-space-0.5)` | 2 |
| `1` | `var(--forge-space-1)` | 4 |
| `2` | `var(--forge-space-2)` | 8 |
| `3` | `var(--forge-space-3)` | 12 |
| `4` | `var(--forge-space-4)` | 16 |
| `5` | `var(--forge-space-5)` | 20 |
| `6` | `var(--forge-space-6)` | 24 |
| `8` | `var(--forge-space-8)` | 32 |
| `10` | `var(--forge-space-10)` | 40 |
| `12` | `var(--forge-space-12)` | 48 |
| `16` | `var(--forge-space-16)` | 64 |
| `'px'` | `1px` | 1 |

### 2.2 Semantic colors

Use semantic color names for `bg` and `c` (color) props — never hardcode hex:

| Token | Usage |
|---|---|
| `bg` | Page background |
| `surface` | Card / panel backgrounds |
| `surface-raised` | Elevated cards, popovers |
| `surface-hover` | Hover state backgrounds |
| `border` | Standard dividers |
| `border-subtle` | Faint dividers |
| `text` | Primary text |
| `text-muted` | Secondary / label text |
| `text-disabled` | Disabled state text |
| `accent` | Brand color highlights |
| `info` · `info-bg` · `info-border` | Informational |
| `success` · `success-bg` · `success-border` | Positive / done |
| `warning` · `warning-bg` · `warning-border` | Caution |
| `danger` · `danger-bg` · `danger-border` | Destructive / error |

### 2.3 No Tailwind

ForgeUI uses inline styles with CSS custom properties. Do **not** add Tailwind classes to ForgeUI components or mix them with ForgeUI layout primitives.

### 2.4 Polymorphism

Use the `as` prop to change the rendered element. Use `asChild` (on Radix-based components) to merge onto a child element:

```tsx
<Box as="section" p={4}>…</Box>    // renders <section>
<Button asChild><a href="/home">Home</a></Button>  // renders <a> with button styles
```

---

## 3. Layout Primitives

All layout primitives accept padding (`p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`),
margin (`m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`), and the consumer's `style` prop
which merges on top.

### Box

Base block element. Use for padding, background, radius, and semantic HTML elements.

```tsx
<Box p={4} bg="surface" radius="md">content</Box>
<Box as="section" px={6} py={3}>semantic section</Box>
<Box c="text-muted" style={{ border: '1px solid var(--forge-border)' }}>muted text</Box>
```

**Key props:** `as` · `p/px/py/pt/pb/pl/pr` · `m/mx/my/...` · `bg` · `c` · `radius` (none/sm/md/lg/xl/full) · `display` · `pos` · `overflow` · `flex` · `gap` · `zIndex` · `opacity`

### Stack

Vertical flex column. The workhorse for forms, sidebars, card bodies.

```tsx
<Stack gap={3}>
  <Label>Name</Label>
  <Input />
  <Text size="xs" color="muted">Helper text</Text>
</Stack>

<Stack gap={4} p={6}>          {/* p works directly — no wrapper Box needed */}
  <Section1 />
  <Section2 />
</Stack>
```

**Key props:** `gap` · `spacing` (alias for gap) · `align` · `justify` · `reverse` · SpacingShorthandProps

### Flex

Full flexbox control. Use when you need row layout, direction control, or inline-flex.

```tsx
<Flex gap={2} align="center" justify="space-between">
  <Logo />
  <NavLinks />
  <Button>Save</Button>
</Flex>

<Flex direction="column" gap={2} inline>…</Flex>
```

**Key props:** `direction` · `wrap` · `align` · `justify` · `gap` · `rowGap` · `columnGap` · `flex` · `inline` · SpacingShorthandProps

### Group

Horizontal composition for inline elements. Defaults to `align="center"` and `gap=2`.
Use `grow` to make all children equal width.

```tsx
<Group>
  <Button>Save</Button>
  <Button variant="ghost">Cancel</Button>
  <Separator orientation="vertical" style={{ height: 20 }} />
  <Badge color="success">Saved</Badge>
</Group>

<Group grow gap={2} style={{ width: 400 }}>
  <Button variant="primary">Confirm</Button>
  <Button variant="ghost">Cancel</Button>
  <Button variant="danger">Delete</Button>
</Group>
```

**Key props:** `gap` · `spacing` · `align` · `grow` · `wrap`

### Spacer

Fills remaining flex space. Use inside `Flex` or `Group` to push items apart.

```tsx
<Flex>
  <Logo />
  <Spacer />          {/* ← pushes everything after it to the right */}
  <Button>Help</Button>
  <Button variant="primary">Save</Button>
</Flex>
```

No props beyond `style`.

### Grid

CSS Grid. `columns` accepts a number (equal fractions) or a template string.

```tsx
{/* Three-panel editor shell */}
<Grid columns="220px 1fr 280px" style={{ height: '100vh' }}>
  <Sidebar />
  <Canvas />
  <Inspector />
</Grid>

{/* Equal columns */}
<Grid columns={3} gap={3}>…</Grid>

{/* Grid.Col for span / area */}
<Grid columns={12} gap={2}>
  <Grid.Col span={8}><MainContent /></Grid.Col>
  <Grid.Col span={4}><Sidebar /></Grid.Col>
</Grid>

{/* Named areas */}
<Grid areas='"header header" "sidebar main"' columns="200px 1fr" rows="48px 1fr">
  <Grid.Col area="header"><Header /></Grid.Col>
  <Grid.Col area="sidebar"><Sidebar /></Grid.Col>
  <Grid.Col area="main"><Main /></Grid.Col>
</Grid>
```

**Grid props:** `columns` · `rows` · `areas` · `gap` · `align` · `justify` · `autoFlow` · `autoColumns` · `autoRows`
**Grid.Col props:** `span` · `offset` · `rowSpan` · `area`

### Center

Centers content with flex `align+justify=center`. Use for empty states, loading screens, modals.

```tsx
<Center style={{ height: '100vh' }}>
  <Spinner size="lg" />
</Center>

<Center inline><Badge>Centered badge</Badge></Center>
```

**Key props:** `inline`

### Container

Max-width wrapper with auto side margins. Use for readable content widths.

```tsx
<Container size="md">
  <Article />        {/* constrained to ~768px, centered */}
</Container>

<Container fluid>   {/* full width, no max-width */}
  <WideTable />
</Container>
```

**Size tokens:** `prose` (~65ch) · `sm` (~480px) · `md` (~768px) · `lg` (~1024px)
**Key props:** `size` · `fluid` · `px` (default 4)

### SimpleGrid

Equal-column grid shorthand. Use `minChildWidth` for responsive auto-fit.

```tsx
{/* Fixed columns */}
<SimpleGrid cols={4} spacing={3}>
  <StatCard /><StatCard /><StatCard /><StatCard />
</SimpleGrid>

{/* Responsive: fills as many columns as fit, each at least 200px */}
<SimpleGrid minChildWidth="200px" spacing={3}>
  {items.map(i => <Card key={i.id}>…</Card>)}
</SimpleGrid>
```

**Key props:** `cols` · `minChildWidth` · `spacing` · `spacingX` · `spacingY`

### Wrap

Flex-wrap container. Use for tag lists, badge groups, button chips.

```tsx
<Wrap gap={2}>
  {tags.map(t => <Badge key={t} variant="subtle">{t}</Badge>)}
</Wrap>
```

**Key props:** `gap` · `spacing` · `align` · `justify` · `direction`

---

## 4. Primitive Components

### Button

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="primary" loading>Saving…</Button>
<Button asChild><a href="/docs">Docs</a></Button>
```

**Variants:** `primary` · `secondary` · `ghost` · `danger` · `outline`
**Sizes:** `sm` · `md` (default) · `lg`
**Key props:** `variant` · `size` · `loading` · `disabled` · `asChild`

### IconButton

```tsx
<IconButton icon={<PlusIcon />} label="Add item" size="sm" variant="ghost" />
```

**Key props:** Same as Button plus `icon` (required) · `label` (required for a11y)

### Badge

```tsx
<Badge color="success" variant="subtle">Active</Badge>
<Badge color="danger" variant="solid">Error</Badge>
<Badge color="warning" variant="outline">Draft</Badge>
```

**Colors:** `accent` · `info` · `success` · `warning` · `danger` · `neutral`
**Variants:** `solid` · `subtle` · `outline`

### Text

```tsx
<Text size="sm" weight="semibold" color="muted">Label text</Text>
<Text truncate>Long text that gets truncated…</Text>
<Text asChild><span>Merged onto span</span></Text>
```

**Sizes:** `xs` · `sm` · `base` · `md` · `lg` · `xl` · `2xl` · `3xl`
**Weights:** `normal` · `medium` · `semibold` · `bold`
**Colors:** `default` · `muted` · `disabled` · `accent` · `inherit`

### Heading

```tsx
<Heading level={1} size="3xl">Page Title</Heading>
<Heading level={2} size="lg">Section</Heading>
<Heading level={3} size="md" weight="semibold">Subsection</Heading>
```

**Key props:** `level` (1–6, required) · `size` · `weight` · `color` · `truncate`

### Card

```tsx
<Card>
  <Card.Header><Text weight="semibold">Title</Text></Card.Header>
  <Card.Body><Text>Content</Text></Card.Body>
  <Card.Footer><Button size="sm">Action</Button></Card.Footer>
</Card>

<Card elevated>…</Card>        {/* stronger shadow */}
<Card style={{ cursor: 'pointer' }} onClick={…}>…</Card>
```

**Sub-components:** `Card.Header` · `Card.Body` · `Card.Footer`
**Key props:** `elevated`

### Separator

```tsx
<Separator />                                    {/* horizontal */}
<Separator orientation="vertical" style={{ height: 20 }} />
<Separator label="Or continue with" />           {/* centered label */}
```

### Spinner

```tsx
<Spinner size="sm" />
<Spinner size="md" label="Loading world data…" />  {/* custom aria-label */}
```

**Sizes:** `sm` · `md` · `lg`

### Kbd

```tsx
<Kbd>⌘K</Kbd>
<Kbd>Ctrl</Kbd>
<Kbd>Shift</Kbd>
```

### ScrollArea

```tsx
<ScrollArea style={{ height: 300 }}>
  {longList}
</ScrollArea>
```

### AlertDialog

Destructive action confirmation with required accessible title.

```tsx
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete entity?"
  description="This cannot be undone."
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

### Label

```tsx
<Label htmlFor="name-input">Entity name</Label>
<Input id="name-input" />
```

### VisuallyHidden

Hides content visually but keeps it in the accessibility tree.

```tsx
<VisuallyHidden>Screen reader only text</VisuallyHidden>
```

---

## 5. Form Components

Always use `FormField` to wrap form controls — it handles label, error, and help text layout.

```tsx
<FormField label="Entity name" error={errors.name?.message} required>
  <Input id="entity-name" {...register('name')} />
</FormField>
```

### Input

```tsx
<Input placeholder="Search…" />
<Input value={val} onChange={e => setVal(e.target.value)} />
<Input error="Required" />
<Input clearable onClear={() => setVal('')} value={val} />
<Input prefix={<SearchIcon />} />
<Input size="sm" />
```

**Key props:** `error` · `clearable` · `onClear` · `prefix` · `suffix` · `size` (sm/md/lg)

### Textarea

```tsx
<Textarea rows={4} placeholder="Description…" />
<Textarea autoGrow />     {/* expands vertically as content grows */}
```

### Select

```tsx
<Select
  id="faction-select"
  value={faction}
  onChange={e => setFaction(e.target.value)}
  options={[
    { value: 'ironback', label: 'Ironback Clan' },
    { value: 'sunguard', label: 'Sunguard' },
  ]}
/>
```

**Note:** Always provide `id` for label association (Radix hides the internal value from the accessibility tree).

### Checkbox

```tsx
<Checkbox checked={val} onCheckedChange={setVal} label="Enable patrol" />
```

### Switch

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} label="Dark mode" />
```

### RadioGroup

```tsx
<RadioGroup
  value={selected}
  onValueChange={setSelected}
  options={[
    { value: 'npc', label: 'NPC' },
    { value: 'boss', label: 'Boss' },
    { value: 'merchant', label: 'Merchant' },
  ]}
/>
```

### Slider

```tsx
<Slider value={[health]} onValueChange={([v]) => setHealth(v)} min={0} max={100} />
```

### NumberInput

```tsx
<NumberInput value={level} onChange={setLevel} min={1} max={20} step={1} />
```

### Toggle / ToggleGroup

```tsx
<Toggle pressed={bold} onPressedChange={setBold} label="Bold" />

<ToggleGroup type="single" value={view} onValueChange={setView}>
  <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
  <ToggleGroup.Item value="list">List</ToggleGroup.Item>
</ToggleGroup>
```

### Combobox

Searchable dropdown with custom options.

```tsx
<Combobox
  value={value}
  onChange={setValue}
  options={[
    { value: 'goblin', label: 'Goblin' },
    { value: 'dragon', label: 'Dragon' },
  ]}
  placeholder="Select entity type…"
  searchPlaceholder="Search types…"
/>
```

### TagsInput

Free-form tag entry with keyboard support (Enter/Backspace).

```tsx
<TagsInput
  value={tags}
  onChange={setTags}
  placeholder="Add trait…"
/>
```

### ColorPicker

```tsx
<ColorPicker value={color} onChange={setColor} />
```

### FormField

```tsx
<FormField
  label="Faction"
  htmlFor="faction-select"
  required
  helpText="The faction this entity belongs to."
  error={error?.message}
>
  <Select id="faction-select" options={factionOptions} />
</FormField>
```

---

## 6. Disclosure Components

### Accordion

```tsx
<Accordion type="single" collapsible>
  <Accordion.Item value="lore">
    <Accordion.Trigger>Lore</Accordion.Trigger>
    <Accordion.Content>
      <Text>Lore content here…</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

**Note:** Closed content is removed from the DOM (Radix behaviour). Don't check for hidden accordion content with `getByText` in tests — use `not.toBeInTheDocument()`.

### Tabs

```tsx
<Tabs defaultValue="stats">
  <Tabs.List>
    <Tabs.Trigger value="stats">Stats</Tabs.Trigger>
    <Tabs.Trigger value="lore">Lore</Tabs.Trigger>
    <Tabs.Trigger value="events">Events</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="stats"><StatsPanel /></Tabs.Content>
  <Tabs.Content value="lore"><LorePanel /></Tabs.Content>
  <Tabs.Content value="events"><EventsPanel /></Tabs.Content>
</Tabs>
```

### Collapsible

```tsx
<Collapsible>
  <Collapsible.Trigger>Advanced options</Collapsible.Trigger>
  <Collapsible.Content>
    <Stack gap={2}>…</Stack>
  </Collapsible.Content>
</Collapsible>
```

---

## 7. Feedback Components

### Alert

```tsx
<Alert variant="info" title="Build started">
  Asset generation is running in the background.
</Alert>

<Alert variant="danger" title="Build failed" live onDismiss={() => setVisible(false)}>
  wraith-elder.psd not found. Check your asset source paths.
</Alert>
```

**Variants:** `info` · `success` · `warning` · `danger`
**Key props:** `variant` · `title` · `live` (sets `role="alert"` for screen readers) · `onDismiss`

### Progress

```tsx
<Progress value={72} max={100} label="Generating assets…" />
<Progress indeterminate label="Loading…" />
```

### Skeleton

```tsx
<Skeleton width={240} height={16} radius="sm" />
<Skeleton width="100%" height={120} />
```

### Toast

```tsx
// In your app root:
<ToastProvider>
  <App />
  <ToastList />
</ToastProvider>

// Anywhere in the tree (via useToast hook):
const { addToast } = useToast()
addToast({ title: 'Saved', variant: 'success' })
addToast({ title: 'Build failed', variant: 'danger', description: 'See log for details.' })
```

**Variants:** `info` · `success` · `warning` · `danger`

---

## 8. Overlay Components

### Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen} title="Create Entity">
  <Stack gap={3}>
    <FormField label="Name"><Input /></FormField>
    <FormField label="Type"><Select options={typeOptions} /></FormField>
  </Stack>
  <Dialog.Footer>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleCreate}>Create</Button>
  </Dialog.Footer>
</Dialog>
```

### Tooltip

Always wrap app root with `TooltipProvider`.

```tsx
<TooltipProvider>
  <Tooltip content="Save changes (⌘S)">
    <Button variant="primary">Save</Button>
  </Tooltip>
</TooltipProvider>
```

### DropdownMenu

```tsx
<DropdownMenu
  trigger={<Button variant="ghost">Actions ▾</Button>}
  items={[
    { type: 'item', label: 'Edit', onSelect: handleEdit },
    { type: 'item', label: 'Duplicate', onSelect: handleDuplicate },
    { type: 'separator' },
    { type: 'item', label: 'Delete', variant: 'danger', onSelect: handleDelete },
  ]}
/>
```

### ContextMenu

Same `items` API as DropdownMenu, wraps children with right-click trigger.

```tsx
<ContextMenu items={menuItems}>
  <div onContextMenu={...}>Right-click me</div>
</ContextMenu>
```

### Popover

```tsx
<Popover
  trigger={<Button variant="ghost">Filters</Button>}
  title="Filter options"
>
  <Stack gap={2}>
    <Checkbox label="Show archived" />
    <Checkbox label="Show drafts" />
  </Stack>
</Popover>
```

---

## 9. Composite Components

### AppShell

Full-page layout with sidebar, header, and main content area.

```tsx
<AppShell
  sidebar={<SidebarNav />}
  header={<Toolbar />}
  footer={<StatusBar />}
>
  <MainContent />
</AppShell>
```

### Drawer

Side panel that slides in from the edge.

```tsx
<Drawer open={open} onOpenChange={setOpen} title="Entity Details" side="right">
  <EntityForm />
</Drawer>
```

**Sides:** `left` · `right` · `top` · `bottom`

### Toolbar

Semantic toolbar container with Toolbar.Button and Toolbar.Separator.

```tsx
<Toolbar>
  <Toolbar.Button onClick={handleSave}>Save</Toolbar.Button>
  <Toolbar.Separator />
  <Toolbar.Button onClick={handleUndo}>Undo</Toolbar.Button>
</Toolbar>
```

### Breadcrumb

```tsx
<Breadcrumb
  items={[
    { label: 'Worlds', href: '/worlds' },
    { label: 'Eldenmoor', href: '/worlds/eldenmoor' },
    { label: 'Goblin Chief' },
  ]}
/>
```

### Steps

Progress stepper for multi-step flows.

```tsx
<Steps
  current={1}
  steps={[
    { label: 'Setup', description: 'Configure project' },
    { label: 'Import', description: 'Import lore data' },
    { label: 'Validate', description: 'Run checks' },
  ]}
/>
```

### Avatar

```tsx
<Avatar name="Lady Aldra" src="/avatars/aldra.png" size="md" />
<Avatar name="Goblin Chief" size="sm" />   {/* falls back to initials */}
```

### Menubar

Application-level menubar (File, Edit, View…).

```tsx
<Menubar
  menus={[
    {
      label: 'File',
      items: [
        { type: 'item', label: 'New World', onSelect: handleNew },
        { type: 'item', label: 'Open…', onSelect: handleOpen },
        { type: 'separator' },
        { type: 'item', label: 'Export', onSelect: handleExport },
      ],
    },
    {
      label: 'Edit',
      items: [
        { type: 'item', label: 'Undo', onSelect: handleUndo },
        { type: 'item', label: 'Redo', onSelect: handleRedo },
      ],
    },
  ]}
/>
```

### ResizablePanel / ResizablePanelGroup

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={25} minSize={15}>
    <Sidebar />
  </ResizablePanel>
  <ResizablePanel>
    <MainContent />
  </ResizablePanel>
</ResizablePanelGroup>
```

### Table

Semantic HTML table with ForgeUI styling.

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Faction</Table.Header>
      <Table.Header>Level</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    {entities.map(e => (
      <Table.Row key={e.id}>
        <Table.Cell>{e.name}</Table.Cell>
        <Table.Cell>{e.faction}</Table.Cell>
        <Table.Cell>{e.level}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### DropZone

```tsx
<DropZone
  onDrop={handleFileDrop}
  accept={['image/png', 'image/jpeg']}
  label="Drop assets here or click to browse"
/>
```

### Pagination

```tsx
<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### AspectRatio

```tsx
<AspectRatio ratio={16 / 9}>
  <img src="…" alt="…" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</AspectRatio>
```

---

## 10. Complex / Data Components

### DataTable

Full-featured sortable, filterable data table.

```tsx
const columns: ColumnDef<Entity>[] = [
  { accessorKey: 'name',    header: 'Name' },
  { accessorKey: 'faction', header: 'Faction' },
  { accessorKey: 'level',   header: 'Level', cell: ({ getValue }) => `Level ${getValue()}` },
]

<DataTable
  data={entities}
  columns={columns}
  filterPlaceholder="Search entities…"
/>
```

### CommandPalette

Global search/command launcher. Bind to `⌘K`.

```tsx
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      label: 'Actions',
      items: [
        { id: 'new-entity', label: 'New Entity', onSelect: handleNew },
        { id: 'export', label: 'Export World', onSelect: handleExport },
      ],
    },
    {
      label: 'Navigation',
      items: [
        { id: 'lore', label: 'Go to Lore Editor', onSelect: () => navigate('/lore') },
      ],
    },
  ]}
/>
```

### TreeView

Collapsible tree for hierarchical data (scene graphs, file trees).

```tsx
<TreeView
  nodes={[
    {
      id: 'world',
      label: 'Eldenmoor',
      children: [
        { id: 'factions', label: 'Factions', children: [
          { id: 'ironback', label: 'Ironback Clan' },
        ]},
      ],
    },
  ]}
  onSelect={setSelectedNode}
/>
```

### PropertyGrid

Key-value inspector for game object properties. Supports multiple input types inline.

```tsx
<PropertyGrid
  sections={[
    {
      label: 'Identity',
      items: [
        { key: 'name',    label: 'Name',    type: 'text',   value: entity.name,    onChange: … },
        { key: 'level',   label: 'Level',   type: 'number', value: entity.level,   onChange: … },
        { key: 'faction', label: 'Faction', type: 'select', value: entity.faction,
          options: [{ value: 'ironback', label: 'Ironback Clan' }], onChange: … },
        { key: 'active',  label: 'Active',  type: 'boolean', value: entity.active, onChange: … },
      ],
    },
  ]}
/>
```

**Item types:** `text` · `number` · `boolean` · `select` · `color` · `readonly`

### EditableText

Click-to-edit inline text field.

```tsx
<EditableText
  value={entity.name}
  onChange={name => updateEntity({ name })}
  placeholder="Unnamed entity"
/>
```

---

## 11. Domain-Specific Components

These are complex, game-dev-specific components. They are wrappers around third-party libraries and carry heavier bundle weight.

### NodeEditor

Visual node graph editor for dialogue trees, AI behaviour graphs, and pipeline flows. Built on `@xyflow/react`.

```tsx
const nodes: FlowNode[] = [
  { id: '1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: '2', type: 'default', position: { x: 200, y: 0 }, data: { label: 'End' } },
]
const edges: FlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
]

<NodeEditor
  nodes={nodes}
  edges={edges}
  onNodesChange={setNodes}
  onEdgesChange={setEdges}
  style={{ height: 400 }}
/>
```

### Timeline

Multi-track timeline editor for cutscenes, animations, and scripted sequences.

```tsx
const tracks: TimelineTrack[] = [
  {
    id: 'dialogue',
    label: 'Dialogue',
    clips: [
      { id: 'c1', trackId: 'dialogue', start: 0, end: 3, label: 'Intro speech' },
    ],
  },
]

<Timeline
  tracks={tracks}
  duration={30}
  currentTime={currentTime}
  onTimeChange={setCurrentTime}
/>
```

### VirtualCanvas

Infinite pan/zoom canvas for world maps, grid editors, and large scene overviews.

```tsx
const items: CanvasItem[] = [
  { id: 'town', x: 100, y: 150, width: 80, height: 60, label: 'Ironkeep' },
]

<VirtualCanvas
  items={items}
  width={800}
  height={600}
  onItemSelect={setSelected}
/>
```

---

## 12. Common Patterns

### Toolbar row (logo + spacer + actions)

```tsx
<Box px={4} py={2} bg="surface" style={{ borderBottom: '1px solid var(--forge-border)' }}>
  <Group gap={2}>
    <Heading level={3} size="sm">Tool Name</Heading>
    <Spacer />
    <Button size="sm" variant="ghost">Help</Button>
    <Button size="sm" variant="primary">Save</Button>
  </Group>
</Box>
```

### Three-panel layout (sidebar + canvas + inspector)

```tsx
<Grid columns="220px 1fr 280px" style={{ height: '100vh' }}>
  <SidebarPanel />
  <CanvasPanel />
  <InspectorPanel />
</Grid>
```

### Form section with heading

```tsx
<Stack gap={4}>
  <Stack gap={1}>
    <Text weight="semibold">Section Title</Text>
    <Separator />
  </Stack>
  <FormField label="Field A"><Input /></FormField>
  <FormField label="Field B"><Input /></FormField>
</Stack>
```

### Status badge row

```tsx
<Group gap={2}>
  {loading && <Spinner size="sm" />}
  <Badge color={error ? 'danger' : saved ? 'success' : 'neutral'} variant="subtle">
    {error ? 'Error' : saved ? 'Saved' : 'Unsaved'}
  </Badge>
</Group>
```

### Responsive stat grid

```tsx
<SimpleGrid minChildWidth="180px" spacing={3}>
  <StatCard label="Entities" value={142} />
  <StatCard label="Quests" value={38} />
  <StatCard label="Factions" value={7} />
</SimpleGrid>
```

### Tag list with wrap

```tsx
<Wrap gap={2}>
  {traits.map(t => (
    <Badge key={t} variant="subtle" color="warning">{t}</Badge>
  ))}
</Wrap>
```

### Empty state with Center

```tsx
<Center style={{ height: 300 }}>
  <Stack gap={3} style={{ textAlign: 'center' }}>
    <Text size="3xl">🌍</Text>
    <Text weight="semibold">No worlds yet</Text>
    <Text color="muted" size="sm">Create your first world to get started.</Text>
    <Button variant="primary" onClick={handleCreate}>Create World</Button>
  </Stack>
</Center>
```

---

## 13. Requesting a Component

If you need UI functionality that ForgeUI doesn't currently provide, file a **Component Request** issue on the ForgeUI repository.

**Before filing:** Check the full component list in this guide and the Storybook (`pnpm storybook`). The component may exist under a different name.

**How to file:**

1. Go to the ForgeUI GitHub repository
2. Click **Issues → New Issue**
3. Select the **"Component Request"** template
4. Fill in all fields — particularly:
   - What game dev tool needs this
   - Which existing components you've already tried
   - A concrete usage example (code or mockup)
   - Whether this is blocking a migration

The issue template will guide you through the rest. A well-described request gets prioritised faster.

---

## 14. Reporting a Bug

If a component behaves unexpectedly, produces accessibility violations, or doesn't match its documented API, file a **Bug Report**.

**How to file:**

1. Go to the ForgeUI GitHub repository
2. Click **Issues → New Issue**
3. Select the **"Bug Report"** template
4. Include:
   - The component name and version (`@forgeui/components@x.y.z`)
   - A minimal reproduction (ideally a Storybook story or code snippet)
   - Expected behaviour vs actual behaviour
   - Browser/environment if relevant

**For AI agents filing bugs:** Include the exact JSX you used, the props you passed, and what you expected to happen. "It doesn't work" is not enough — paste the code.

---

*This guide is updated with each ForgeUI release. If something is missing or wrong, please file an issue.*
