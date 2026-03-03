How to force your agent to obey your design system (steal this 5-layer setup)
Most design systems fail for one simple reason: they are optional.
If you want reliable UI consistency, you need to stop treating your design system as guidance and start treating it like a contract.
This post walks through a practical, repeatable way to do that. It is based on my real production setup, but the pattern is general enough to use in any codebase, with any framework, and with any coding agent.
(You can also cheat and just tell your agent to read this and implement the system :D)
What is a design system?
A design system is a shared contract for how your UI is built and how it behaves.
At minimum, it usually includes:
Design tokens (color, spacing, typography, radius, elevation)
Reusable components (buttons, forms, cards, modals, etc.)
Interaction patterns (layout, navigation, error states, progressive disclosure)
Usage rules (what to do, what to avoid, and what is required)
Without this contract, every new surface drifts. With it, your product stays consistent even as code is generated quickly by agents.
Why docs alone don’t work
Documentation is necessary, but not sufficient.
An agent can read your style rules and still generate raw spacing classes.
An agent can have your typography standards available and still hardcode `text-[44px]` to match a mock.
An agent can skip your form wrapper and import raw primitives directly.
None of this happens because your agent is trying to spite you. It happens because the system doesn’t make the right thing the easiest thing.
To fix this, you need enforcement at every stage of work.
The enforcement model
A deterministic design-system workflow has five layers:
Canonical docs: one source of truth for visual language and interaction rules.
Agent routing: a skill or instruction layer that forces the agent to use those docs.
Local lint rules: custom checks that fail on noncompliant code.
Pre-commit hooks: staged-file checks that run automatically before commits.
CI gates: merge-time checks that block drift from entering main.
The point is not any single layer. The point is overlap. If one layer misses something, another catches it.

1. Canonical docs: write rules that can be enforced
   Most style guides are too vague to lint.
   “Use consistent spacing” is not lintable.
   “Use semantic spacing tokens (`xxs`, `xs`, `s`, `m`, `l`) and never raw numeric utilities (`mt-3`, `px-4`, `gap-2`)” is lintable.
   When writing your design docs, separate them into three documents with clear jobs:
   Design rules: hard DO/NEVER policy.
   Visual language: token mappings, component styling primitives, typography/color contracts.
   Interaction patterns: layout and behavior contracts for flows and surfaces.
   Then add an explicit “Machine Enforcement” section that names the commands and gate behavior. If it isn’t in that section, it isn’t contractually real.
2. Agent routing: make the agent consult the right source first
   If you use coding agents, add a dedicated design-system/SKILL.md.
   Its job is simple:
   Route design-related tasks to the right docs.
   Prevent ad-hoc styling decisions.
   Keep visual guidance centralized.
   This turns “remember to check the design system” into deterministic behavior.
   A useful mental model: your agent should behave like a compiler pipeline, not a chat partner. Inputs route through policy, then implementation happens.
3. Custom lint rules: encode your design contract in code
   Off-the-shelf linters won’t fully enforce your design system. You need custom rules for your actual standards.
   Typical high-value checks:
   Spacing token check: ban raw spacing utilities; require semantic spacing tokens.
   Color token check: ban raw hex/rgb/hsl literals and arbitrary color utilities.
   Token contract check: ensure CSS vars, Tailwind tokens, and component primitives stay aligned.
   Typography constant check: require shared heading constants, disallow raw heading utilities.
   Shared wrapper check: enforce form wrappers over raw primitives.
   Keep the rules strict, but practical. Add explicit exception markers for rare edge cases, and require a reason when used.
   typescript
   // pseudo-rule
   if (classToken.matches(/^(mt|mb|px|py)-\d+$/)) {
   fail("Use semantic spacing token (e.g. mt-s), not numeric utility");
   }
   The exact implementation is less important than the principle: if a violation can be detected, it should be blocked automatically.
4. Pre-commit hook: fail fast on staged files
   Pre-commit is where compliance becomes habit.
   Run your design-system staged lint as a single command in the hook. Keep one entrypoint so agents don’t have to route through multiple overlapping commands.
   bash
   npm run lint:design-system:staged
   That command should orchestrate your design checks (spacing, color, token contract, forms, typography, etc.) for staged files.
   Why staged?
   Fast feedback.
   Focused signal.
   Low friction for iterative work.
   When agents get immediate, actionable failures before commit, fixes happen while context is fresh.
5. CI gate: enforce the same contract remotely
   Local checks are necessary, but not authoritative.
   CI must run the same design-system contract and fail the PR if drift is introduced. Otherwise, compliance depends on whether each local execution environment ran the same checks.
   Recommended pattern:
   Run changed-files design-system lint on PRs.
   Optionally run full-repo sweeps on schedule or before major release branches.
   Treat failures as blocking.
   This is the difference between “we encourage design consistency” and “we guarantee design consistency.”
   Scope is everything
   One reason enforcement projects fail: teams try to lint everything immediately.
   Start with intentional scope.
   For many products, that means enforcing the logged-in app first, while deferring admin surfaces and legacy marketing pages until they get a dedicated redesign pass.
   Document this clearly in both your docs and lint scope rules. Ambiguous scope creates endless false positives and policy fatigue.
   Exception handling without chaos
   You will need exceptions. The goal is controlled exceptions.
   Use a simple policy:
   Exceptions require an inline marker.
   Marker must include a short reason.
   Exceptions are reviewed like code debt.
   Periodically audit and remove stale exceptions.
   This keeps your system strict without becoming brittle.
   What this looks like day-to-day
   A typical workflow looks like this:
   A task prompt asks an agent to build a new UI surface.
   Agent routes through design-system skill and docs.
   Agent writes code using shared constants/tokens/wrappers.
   Pre-commit runs staged design lint.
   Any violation fails immediately with a specific message.
   The agent fixes violations.
   CI reruns the same contract on PR.
   Merge proceeds only when design checks are green.
   At that point, design consistency is no longer dependent on memory, taste, or discipline.
   How to adopt this in your repo
   You can roll this out if you keep scope tight:
   Consolidate design docs into clear policy + token references.
   Add a design-system skill/instruction router for your agent.
   Implement 2-3 high-value custom lint checks first (spacing, color, wrappers).
   Create one orchestrator command (`lint:design-system`).
   Add staged variant and wire it into pre-commit.
   Add CI gate using the same command contract.
   Add explicit scope and exception policy.
   Expand rules incrementally as violations stabilize.
   Don’t start with perfection. Start with determinism.
   Common failure modes
   Watch out for these:
   Multiple competing lint entrypoints that confuse agent workflows.
   Docs that reference deleted files or outdated commands.
   Rules that are strict but not actionable.
   Scope that includes un-migrated surfaces too early.
   No exception policy, leading to silent ad-hoc bypasses.
   The cure is always the same: centralize, simplify, and make enforcement explicit.
   Final takeaway
   If you want your agent to use your design system, don’t ask politely.
   Encode the design system as a contract.
   Route every UI task through it.
   Run local and remote gates that fail deterministically.
   Keep docs, linters, hooks, and CI in lockstep.
   Once you do that, design consistency stops being aspirational and starts being automatic.
