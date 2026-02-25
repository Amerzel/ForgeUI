# Contributing to ForgeUI

ForgeUI is the shared design system for the game dev toolchain. This document covers
how to contribute — whether you're a human developer or an AI agent working inside
one of the 9 tools.

---

## Quick Links

- **Component reference:** [docs/AGENT-GUIDE.md](docs/AGENT-GUIDE.md)
- **Project status:** [docs/TASKS.md](docs/TASKS.md)
- **Architecture decisions:** [docs/PLAN.md](docs/PLAN.md)
- **v1.0.0 rollout plan:** [docs/ROLLOUT.md](docs/ROLLOUT.md)
- **Theme extension guide:** [docs/THEME-EXTENSION.md](docs/THEME-EXTENSION.md)
- **Interactive demos:** run `pnpm storybook` from the repo root

---

## I found a bug — what do I do?

1. **Check the docs first.** Many "bugs" are usage mistakes. Read [AGENT-GUIDE.md](docs/AGENT-GUIDE.md) and the Storybook story for the component.

2. **File a Bug Report issue** using the [Bug Report template](https://github.com/Amerzel/ForgeUI/issues/new?template=bug-report.yml).

3. Include a **minimal reproduction** — the smallest code that shows the problem. "It doesn't work" will not get a fast response. Paste the JSX.

4. If the bug causes a WCAG accessibility violation, mark severity as "Accessibility" — these get highest priority.

---

## I need a component that doesn't exist — what do I do?

1. **Check the guide first.** ForgeUI has 50+ components. Read [AGENT-GUIDE.md](docs/AGENT-GUIDE.md) — the component you need may exist under a different name, or may be composable from layout primitives.

2. **Try to compose it.** Many one-off UI needs can be covered by combining `Box`, `Stack`, `Flex`, `Grid`, and the component library. If you can get 80% of the way there with composition, do that first.

3. **File a Component Request** using the [Component Request template](https://github.com/Amerzel/ForgeUI/issues/new?template=component-request.yml).

4. Include: which tool needs it, what you've already tried, and (if possible) a sketch of the proposed API. Requests with concrete use cases and prior-art research get implemented first.

---

## I want to contribute code — how does the project work?

### Monorepo structure

```
packages/
  tokens/      — @forgeui/tokens     CSS custom properties, OKLCH color scales
  components/  — @forgeui/components All UI components (Radix + inline styles)
  hooks/       — @forgeui/hooks      useTheme, useTokens
  icons/       — @forgeui/icons      Lucide + 10 custom game dev icons

apps/
  docs/        — Storybook (stories for every component)

docs/          — Architecture docs, guides, PRDs
```

### Dev commands

```bash
pnpm install        # install all dependencies
pnpm dev            # start Storybook
pnpm storybook      # alias for pnpm dev
pnpm build          # build all packages
pnpm test           # run all tests (Vitest)
pnpm typecheck      # tsc --noEmit across all packages
pnpm lint           # ESLint across all packages
```

### Adding a component

1. Create the component file in `packages/components/src/{category}/MyComponent.tsx`
2. Export it from `packages/components/src/index.ts`
3. Write tests in `packages/components/src/{category}/__tests__/`
4. Add a Storybook story in `apps/docs/stories/{category}/`
5. Update `docs/AGENT-GUIDE.md` with the component reference entry

### Design conventions

- **Inline styles only** — no CSS Modules, no Tailwind, no className-based styling
- **CSS custom properties** — always reference design tokens (`var(--forge-*)`) not raw values
- **Radix Primitives** for interactive components (Radix handles a11y, keyboard, focus)
- **React 19** — no `forwardRef`, use `use()` hook for context
- **Compound components** via `Object.assign(Root, { Sub: Sub })` pattern
- **Token-aware props** — shorthand props (`p`, `bg`, `radius`, `gap`) via `sp()`, `col()`, `rad()` helpers in `layoutUtils.ts`

### Testing requirements

Every component must have:
- At minimum: render test + key prop tests + `axe` accessibility audit
- Tests must wrap with `<ThemeProvider>` — see existing test files for the pattern
- Use `getEl(container)` to navigate past the ThemeProvider wrapper div in layout tests

### Changeset (publishing)

We use [Changesets](https://github.com/changesets/changesets) for versioning.
Before merging a change that affects a package's public API:

```bash
pnpm changeset      # follow the prompts
# commit the generated .changeset/*.md file
```

The CI release workflow (`release.yml`) automatically publishes when a Version PR is merged.

---

## Code of conduct

This is a solo developer project. Be direct, be specific, be helpful.
For AI agents: write good bug reports and component requests — describe the problem
clearly, include code, and explain the context. That's all that's needed.
