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