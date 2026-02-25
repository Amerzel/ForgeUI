# Repository Guidelines

## Project Structure
- `packages/tokens/`: Design tokens — colors, spacing, typography, shadows, animations, z-index, and color manipulation utils. Published as `@forgeui/tokens`.
- `packages/components/`: React component library built on Radix Primitives. Internal `lib/cn.ts` for class merging. Published as `@forgeui/components`.
- `packages/icons/`: Shared SVG icon components (Lucide React + custom game icons). Published as `@forgeui/icons`.
- `packages/hooks/`: Shared React hooks (theme, token access for canvas/WebGL). Published as `@forgeui/hooks`.
- `apps/docs/`: Storybook 8 documentation site with component playground and usage guides.

## Build, Test, and Development Commands
- `pnpm install`: install all dependencies across workspaces.
- `pnpm dev`: start Storybook dev server for interactive component development.
- `pnpm build`: build all packages (tokens → components → icons → hooks).
- `pnpm test`: run Vitest tests across all packages.
- `pnpm lint`: run ESLint + Prettier checks.
- `pnpm changeset`: create a changeset for versioning.

## Coding Style & Naming Conventions
- TypeScript strict mode. No `any` in public API surfaces.
- Components: PascalCase files and exports (`Button.tsx`, `FormField.tsx`).
- Tokens: camelCase exports (`spacing`, `colors`), kebab-case CSS variables (`--forge-space-4`).
- Hooks: camelCase with `use` prefix (`useTheme.ts`, `useKeyboardShortcut.ts`).
- CSS: Vanilla CSS Modules with CSS variables from `@forgeui/tokens`. No Tailwind, no CSS-in-JS.
- Class merging: Use `clsx` only (internal `cn.ts` in components). No tailwind-merge.
- All components use `forwardRef` for ref forwarding and accept `className` for composition.

## Testing Guidelines
- Use Vitest + Testing Library for component tests.
- Every component must have at least: render test, accessibility audit (axe-core), keyboard interaction test.
- Stories double as visual documentation — every component variant has a Storybook story.

## Commit & Pull Request Guidelines
- Commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- Use Changesets for version bumps — run `pnpm changeset` before PR.
- PRs must include: component screenshot/story link, test evidence, accessibility audit result.

## Design Principles
- **Dark-first**: Default theme is dark (game dev aesthetic). Light mode is an alternate theme.
- **Accessible by default**: Radix Primitives provide keyboard + screen reader support. Never bypass.
- **Token-driven**: All visual properties reference tokens. No hardcoded colors/sizes in components.
- **Composable**: Components expose slots and render props for customization without forking.
- **Tree-shakeable**: Individual component imports (`@forgeui/components/Button`) for minimal bundle size.
