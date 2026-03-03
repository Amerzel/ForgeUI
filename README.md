# ForgeUI

Shared design system for 9 game development tools. 59 React 19 components built on Radix Primitives with token-based styling.

## Packages

| Package                                                | Description                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| [`@forgeui/tokens`](packages/tokens/README.md)         | Design tokens — CSS custom properties, JS constants, color utilities |
| [`@forgeui/components`](packages/components/README.md) | 59 React 19 components                                               |
| [`@forgeui/icons`](packages/icons/README.md)           | Curated Lucide React + 10 custom game dev icons                      |
| [`@forgeui/hooks`](packages/hooks/README.md)           | `useTheme`, `useTokens` for canvas/WebGL access                      |

All packages are at **v1.0.0** and use fixed versioning — they always release together.

## Quick start (consuming a tool)

```bash
npm install @forgeui/components @forgeui/tokens
```

```ts
// 1. Import CSS at your app root
import '@forgeui/tokens/tokens.css'
import '@forgeui/components/styles/base.css'
```

```tsx
// 2. Wrap your app in ThemeProvider
import { ThemeProvider, Button, Input } from '@forgeui/components'

export function App() {
  return (
    <ThemeProvider palette="midnight-forge-v2" mode="dark">
      <YourApp />
    </ThemeProvider>
  )
}
```

## Palettes

| Palette             | Accent          | Character           |
| ------------------- | --------------- | ------------------- |
| `midnight-forge-v2` | Gold `#f59e0b`  | Navy/gold (default) |
| `hearth-bronze`     | Amber `#d97706` | Warm forge workshop |
| `midnight-forge`    | Blue `#4f8ff7`  | Cool navy           |
| `deep-space`        | Teal `#14b8a6`  | Deep navy           |

All palettes use a 3px default radius for a sharp, precision-tool aesthetic.

## Component inventory (59 total)

**Phase 1 — Foundation**
`Button` `IconButton` `Badge` `Text` `Heading` `Separator` `Card` `Kbd` `ScrollArea` `Label` `VisuallyHidden` `Spinner` `AlertDialog` `Input` `Textarea` `Select` `Checkbox` `Switch` `RadioGroup` `Slider` `Toggle` `ToggleGroup` `FormField` `NumberInput` `Accordion` `Tabs` `Alert` `Progress` `Skeleton` `Toast` `Dialog` `Tooltip` `DropdownMenu` `ContextMenu` `Popover`

**Phase 2a — Composites & Layout**
`Drawer` `Toolbar` `ResizablePanelGroup` `Collapsible` `Menubar` `Steps` `Avatar` `AspectRatio` `Table` `Breadcrumb` `AppShell` `DropZone` `Pagination`

**Phase 2b — Complex Inputs & Data**
`DataTable` `CommandPalette` `TreeView` `Combobox` `ColorPicker` `TagsInput` `PropertyGrid` `EditableText`

**Phase 3 — Domain-Specific**
`NodeEditor` `Timeline` `VirtualCanvas`

## Development

```bash
pnpm install
pnpm dev        # Storybook dev server (component docs)
pnpm build      # Build all packages
pnpm test       # Run all tests (274 passing, 0 axe violations)
pnpm lint       # ESLint + Prettier
pnpm typecheck  # TypeScript across all packages
```

## Documentation

| Document                                           | Description                                                    |
| -------------------------------------------------- | -------------------------------------------------------------- |
| [docs/PLAN.md](docs/PLAN.md)                       | Full design system specification — tokens, components, theming |
| [docs/THEME-EXTENSION.md](docs/THEME-EXTENSION.md) | Tool-specific token extensions via `ThemeContract<T>`          |
| [docs/ROLLOUT.md](docs/ROLLOUT.md)                 | Migration guide and order for each tool                        |
| [docs/TASKS.md](docs/TASKS.md)                     | Implementation task breakdown                                  |
| Storybook                                          | Run `pnpm dev` — live docs for all 59 components               |

## Tool ecosystem

| Tool                  | Purpose                                 | Migration              |
| --------------------- | --------------------------------------- | ---------------------- |
| **PipelineInspector** | Asset/build pipeline monitoring         | Pilot — first          |
| **EntityArchitect**   | Entity and character design             | 2nd                    |
| **QuestForge**        | Quest and narrative generation          | 3rd                    |
| **EncounterComposer** | Encounter and scenario building         | 4th                    |
| **AssetGenerator**    | Asset creation pipeline                 | 5th                    |
| **Director**          | Narrative direction                     | 6th                    |
| **TerrainComposer**   | World and terrain generation            | 7th                    |
| **LoreEngine**        | Worldbuilding knowledge graph           | Last (largest)         |
| **Crucible**          | Core framework — `@forgeui/tokens` only | No component migration |

## Architecture

- **Styling**: Inline styles using CSS custom properties — no CSS Modules, no runtime CSS-in-JS
- **Primitives**: Radix UI for accessibility (keyboard nav, ARIA, focus management)
- **Build**: tsup → ESM + CJS + TypeScript declarations
- **Monorepo**: pnpm workspaces + Turborepo (`tokens → hooks → components`; `icons` parallel)
- **Testing**: Vitest + Testing Library + vitest-axe (zero-violation policy)
- **Versioning**: Changesets with fixed group versioning

## License

[MIT](LICENSE)
