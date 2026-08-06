import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Everything tested here is pure logic — schemas, slugs, label maps. No
    // jsdom or the React plugin until this package actually tests a component,
    // which would need both.
    environment: 'node',
    globals: true,
  },
})
