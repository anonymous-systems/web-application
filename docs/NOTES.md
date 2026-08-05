# Notes

## Authenticate to Google Cloud
https://cloud.google.com/docs/authentication/use-service-account-impersonation
For local development, you can authenticate by running (must have the Google Cloud CLI installed):
```bash
gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL
```
Replace `SERVICE_ACCT_EMAIL` with the email of the service account you want to impersonate.

## Firebase Emulators
To run the Firebase emulators, you must add the following to the environment variables:
```bash
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199

NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
NEXT_PUBLIC_STORAGE_EMULATOR_HOST=localhost:9199
```
`FIREBASE_AUTH_EMULATOR_HOST`, `FIRESTORE_EMULATOR_HOST`, and `FIREBASE_STORAGE_EMULATOR_HOST`
connect the Firebase **Admin SDK** to the emulators (storage is needed for story cover uploads).

The `NEXT_PUBLIC_*` equivalents connect the Firebase **Client SDK** to the emulators.


## Setup Cypress
To run Cypress tests, you need to set up the environment variables in a `cypress.env.json` file.
Copy the following template from cypress.env.example.json to cypress.env.json and fill in the values:
```json
{
  "firebaseConfig": {
    "apiKey": "api-key",
    "authDomain": "auth-domain.firebaseapp.com",
    "databaseURL": "database-url.firebaseio.com",
    "projectId": "project-id",
    "storageBucket": "storage-bucket.appspot.com",
    "messagingSenderId": "messaging-sender-id",
    "appId": "app-id",
    "measurementId": "measurement-id"
  },
  "firebaseRecaptchaSiteKey": "reCAPTCHA_SITE_KEY",
  "firebaseAppCheckDebugToken": "some-debug-token",
  "firebaseAuthEmulatorHost": "localhost:9099"
}
```
This ensures firebase is properly configured for Cypress tests.

## Firebase App Hosting
To deploy to Firebase App Hosting properly, you need to add the environment variables to the yaml file.

## Firebase App Hosting Secrets
Non-public values (API keys, service-account credentials, cookie signing keys) live in Cloud
Secret Manager and are referenced from each backend's `apphosting.yaml` with `secret:` — never
committed as a plaintext `value:`.

### Cookie signing secrets
`next-firebase-auth-edge` signs the auth cookie with `cookieSignatureKeys: [CURRENT, PREVIOUS]`
(see `packages/firebase-config/auth.ts`). Each App Hosting app gets its own distinct pair so
sessions stay isolated per app. The admin app uses `APPHOSTING_ADMIN_COOKIE_SECRET_CURRENT`
and `APPHOSTING_ADMIN_COOKIE_SECRET_PREVIOUS`.

1. Generate two *different* strong random values (run twice):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   # or: openssl rand -base64 32
   ```
2. Store each in Secret Manager (paste the value at the hidden prompt):
   ```bash
   firebase apphosting:secrets:set APPHOSTING_ADMIN_COOKIE_SECRET_CURRENT --project <project-id>
   firebase apphosting:secrets:set APPHOSTING_ADMIN_COOKIE_SECRET_PREVIOUS --project <project-id>
   ```
   When prompted:
   - Grant access to a backend → **yes**, select the app's backend (e.g. `web-application`).
   - Add to `apphosting.yaml` → **no** (already referenced there; avoids a duplicate entry).

Both must exist or cookie signing fails (`auth.ts` reads them with non-null assertions).
`PREVIOUS` is only exercised during rotation: move `CURRENT` → `PREVIOUS`, then set a new `CURRENT`.

### Reusing existing shared secrets
Genuinely project-wide secrets (e.g. the Admin SDK service account) are reused by granting the
new backend access — no new value needed:
```bash
firebase apphosting:secrets:grantaccess APPHOSTING_FIREBASE_ADMIN_PRIVATE_KEY --backend <backend-id>
firebase apphosting:secrets:grantaccess APPHOSTING_FIREBASE_ADMIN_CLIENT_EMAIL --backend <backend-id>
```
Per-app values are **not** shared — each Firebase web app has its own browser API key (plus its
own `appId`, `measurementId`, and reCAPTCHA key). Create a separate secret for each app's API
key (e.g. `APPHOSTING_ADMIN_FIREBASE_API_KEY`) with `apphosting:secrets:set`, like the cookie
secrets above.

## Firebase App Check
Ensure the service account you are using has the `firebaseappcheck.appCheckTokens.verify` permission.
Add the `Firebase App Check Token Verifier` permission to the service account you are
using to run the application.

## Story migration (legacy → current shape)
Existing `stories` from the previous app need a one-time conversion to the current model. The
idempotent script `apps/admin/scripts/migrate-stories.ts` handles it — its header documents the full
"export prod → dry-run against a local copy → run → production" runbook.
```bash
# dry-run against the local emulator
DRY_RUN=yes pnpm --filter admin migrate:stories
# production (after validating against a prod copy)
CONFIRM_PROD=yes FIREBASE_PROJECT_ID=<prod-project> pnpm --filter admin exec tsx scripts/migrate-stories.ts
```

## shadcn/ui tips

### Check if component is different from latest version
```bash
pnpm dlx shadcn@latest diff [component-name] -c packages/ui
# example:
pnpm dlx shadcn@latest diff button -c packages/ui
```
