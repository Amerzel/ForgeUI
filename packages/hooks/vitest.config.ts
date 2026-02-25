import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'hooks',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
    },
  },
})
