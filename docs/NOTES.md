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

NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
```
`FIREBASE_AUTH_EMULATOR_HOST` is required for the Firebase Admin SDK to connect to the emulator
`FIRESTORE_EMULATOR_HOST` is required for the Firebase Admin SDK to connect to the emulator

`NEXT_PUBLIC_AUTH_EMULATOR_HOST` is required for the Firebase Client SDK to connect to the emulator
`NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST` is required for the Firebase Client SDK to connect to the emulator


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