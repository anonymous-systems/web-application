import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    baseUrl: 'http://localhost:3000',
    env: {
      adminUrl: 'http://localhost:3001',
    },
    // Against `next dev` the first hit on a route compiles it, and App Router
    // holds the URL until the RSC payload lands — CI saw 4.9s on a cold cache,
    // past the 4s default.
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 90000,
    experimentalRunAllSpecs: true
  },
});
