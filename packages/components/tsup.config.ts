import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'ThemeProvider/index': 'src/ThemeProvider/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', '@forgeui/tokens', '@forgeui/hooks'],
  // Prepend 'use client' to all component entry points for RSC compatibility
  banner: {
    js: "'use client'",
  },
})
