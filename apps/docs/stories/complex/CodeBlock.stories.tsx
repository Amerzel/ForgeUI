import type { Meta, StoryObj } from '@storybook/react'
import { CodeBlock } from '@forgeui/components'

const meta: Meta<typeof CodeBlock> = {
  title: 'Complex/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Syntax-highlighted read-only code block with copy button and optional line numbers.' } },
  },
}
export default meta
type Story = StoryObj<typeof CodeBlock>

export const TypeScript: Story = {
  args: {
    language: 'typescript',
    showLineNumbers: true,
    code: `interface Character {
  name: string
  class: 'warrior' | 'mage' | 'rogue'
  level: number
  skills: string[]
}

function levelUp(char: Character): Character {
  return {
    ...char,
    level: char.level + 1,
  }
}`,
  },
}

export const JSON: Story = {
  name: 'JSON',
  args: {
    language: 'json',
    code: `{
  "name": "Forge",
  "version": "2.0.0",
  "modules": ["rules-explorer", "schema-browser", "terrain-workbench"],
  "settings": {
    "theme": "dark",
    "autosave": true
  }
}`,
  },
}

export const Bash: Story = {
  args: {
    language: 'bash',
    code: `#!/bin/bash
# Build and deploy Forge
pnpm install
pnpm build
pnpm test --run
echo "Deploy complete ✓"`,
  },
}

export const PlainText: Story = {
  name: 'Plain Text',
  args: {
    language: 'text',
    showCopy: false,
    code: `[INFO]  Server started on port 3000
[INFO]  Connected to database
[WARN]  Cache miss for key: user_preferences
[INFO]  Request processed in 42ms`,
  },
}

export const WithMaxHeight: Story = {
  name: 'Scrollable (maxHeight)',
  args: {
    language: 'typescript',
    showLineNumbers: true,
    maxHeight: '200px',
    code: Array.from({ length: 30 }, (_, i) => `const line${i + 1} = "value ${i + 1}";`).join('\n'),
  },
}
