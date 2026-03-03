# Repository Guidelines

## Project Structure

- `packages/tokens/`: Design tokens — colors, spacing, typography, shadows, animations, z-index, and color manipulation utils. Published as `@forgeui/tokens`.
- `packages/components/`: React 19+ component library (74 components) built on Radix Primitives. Organized into `primitives/`, `forms/`, `disclosure/`, `feedback/`, `overlays/`, `navigation/`, `composites/`, `complex/`, `domain/`. Internal `lib/cn.ts` for class merging. Published as `@forgeui/components`.
- `packages/icons/`: Shared SVG icon components (Lucide React + custom game icons). Published as `@forgeui/icons`.
- `packages/hooks/`: Shared React hooks (theme, token access for canvas/WebGL). Published as `@forgeui/hooks`.
- `apps/docs/`: Storybook 8 documentation site with component playground and usage guides.

## Build, Test, and Development Commands

- `pnpm install`: install all dependencies across workspaces.
- `pnpm dev`: start Storybook dev server for interactive component development.
- `pnpm build`: build all packages (tokens → hooks → components; tokens → icons parallel).
- `pnpm test`: run Vitest tests across all packages.
- `pnpm lint`: run ESLint + Prettier checks.
- `pnpm changeset`: create a changeset for versioning.

## Coding Style & Naming Conventions

- TypeScript strict mode. No `any` in public API surfaces.
- Components: PascalCase files and exports (`Button.tsx`, `FormField.tsx`).
- Tokens: camelCase exports (`spacing`, `colors`), kebab-case CSS variables (`--forge-space-4`).
- Hooks: camelCase with `use` prefix (`useTheme.ts`, `useKeyboardShortcut.ts`).
- CSS: CSS Modules (`.module.css`) pre-compiled via PostCSS (`postcss-modules`) at build time. Consumers import pre-scoped CSS — no CSS Module bundler support needed. No Tailwind, no CSS-in-JS.
- Class merging: Use `clsx` only (internal `cn.ts` in components). No tailwind-merge.
- All components accept `ref` natively (React 19 — no `forwardRef`) and `className` for composition.
- Composition: Use `asChild` prop (via `@radix-ui/react-slot`) instead of polymorphic `as` prop.

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

## Design System Rules

### Tokens — DO / NEVER

- **DO** use CSS custom properties (`var(--forge-*)`) for all colors, spacing, typography, shadows, radii, and z-index.
- **DO** reference semantic token names (`--forge-color-surface`, `--forge-space-4`) rather than raw scale values.
- **NEVER** hardcode hex (`#1a1a2e`), rgb (`rgb(26, 26, 46)`), or hsl values in component styles. Use `var(--forge-color-*)` tokens.
- **NEVER** hardcode pixel values for spacing. Use `var(--forge-space-*)` tokens.
- **NEVER** hardcode font sizes or font families. Use `var(--forge-font-*)` and `var(--forge-text-*)` tokens.
- **NEVER** hardcode z-index numbers. Use `var(--forge-z-*)` tokens (`base`, `dropdown`, `sticky`, `overlay`, `modal`, `toast`, `tooltip`).

### Components — DO / NEVER

- **DO** use existing ForgeUI components before creating new ones. Check the Storybook for available components.
- **DO** accept `className` prop on all components for consumer composition.
- **DO** use `asChild` (via `@radix-ui/react-slot`) for component polymorphism. Never use an `as` prop.
- **DO** use `clsx` (via internal `cn.ts`) for class merging. Never use `tailwind-merge` or string concatenation.
- **NEVER** use `forwardRef` — React 19 supports `ref` as a native prop.
- **NEVER** use `any` in public API type signatures. Use `unknown`, generics, or explicit types.
- **NEVER** bypass Radix Primitive accessibility features (keyboard handling, ARIA attributes, focus management).

### Styling — DO / NEVER

- **DO** use inline styles with CSS custom properties (`style={{ color: 'var(--forge-color-text)' }}`).
- **DO** use opacity-only CSS animations for Radix/Floating UI positioned components (Tooltip, Popover, DropdownMenu) to avoid transform conflicts.
- **NEVER** use CSS-in-JS libraries (styled-components, Emotion, etc.).
- **NEVER** use Tailwind CSS utility classes.
- **NEVER** use CSS Modules in new components — all styling is inline with `var(--forge-*)` properties.
