import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Rules specs talk to the Firestore emulator, so they are deliberately kept
    // out of the per-project `test` target that nx runs. `pnpm test:rules`
    // wraps them in `emulators:exec`, mirroring how `test:e2e` works.
    include: ['tests/rules/**/*.test.ts'],
    environment: 'node',
    globals: true,
    // One shared emulator instance; parallel suites would clear each other's data.
    fileParallelism: false,
  },
})
