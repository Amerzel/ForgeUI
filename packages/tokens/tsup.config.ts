import { defineConfig } from 'tsup'
import { copyFileSync } from 'fs'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    color: 'src/color.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  onSuccess: async () => {
    // Copy generated tokens.css to dist
    try {
      copyFileSync('src/tokens.css', 'dist/tokens.css')
      console.log('✓ tokens.css copied to dist')
    } catch {
      console.warn('⚠ tokens.css not found — run generate-scales first')
    }
  },
})
