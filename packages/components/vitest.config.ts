import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'components',
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/**/*.test.*', 'src/**/*.stories.*', 'src/test-setup.ts'],
    },
  },
})
