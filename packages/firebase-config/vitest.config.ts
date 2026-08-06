import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Server-side Firebase code only — no DOM here.
    environment: 'node',
    globals: true,
  },
})
