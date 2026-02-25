import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: ['packages/*/vitest.config.ts', 'apps/*/vitest.config.ts'],
    reporter: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['**/dist/**', '**/coverage/**', '**/*.stories.tsx', '**/*.config.ts'],
    },
  },
})
