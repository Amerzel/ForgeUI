# ForgeUI

Unified design system for the game development tool suite.

## Tools in the ecosystem

| Tool | Purpose |
|------|---------|
| **LoreEngine** | Worldbuilding knowledge graph + AI agents |
| **AssetGenerator** | Asset creation |
| **Crucible** | Core framework |
| **Director** | Game direction / narrative |
| **EncounterComposer** | Encounter and scenario building |
| **EntityArchitect** | Entity and character design |
| **PipelineInspector** | Asset/build pipeline monitoring |
| **QuestForge** | Quest and narrative generation |
| **TerrainComposer** | World and terrain generation |

## Architecture

- **Foundation**: Radix Primitives + custom token-based styling
- **Monorepo**: Turborepo + pnpm workspaces
- **Build**: tsup (TS → ESM/CJS)
- **Docs**: Storybook 8
- **Testing**: Vitest + Testing Library

## Packages

| Package | Description |
|---------|-------------|
| `@forgeui/tokens` | Design tokens — colors, spacing, typography, shadows, animations |
| `@forgeui/components` | React component library (~40 components across 7 categories) |
| `@forgeui/icons` | Shared icon set |
| `@forgeui/hooks` | Shared React hooks (theme, shortcuts, media queries) |

## Quick start

```bash
pnpm install
pnpm dev        # Storybook dev server
pnpm build      # Build all packages
pnpm test       # Run all tests
```

## Documentation

See [docs/PLAN.md](docs/PLAN.md) for the comprehensive design system plan.
