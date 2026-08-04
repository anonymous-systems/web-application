# Firebase Setup

## Firebase Project ID
Development environment setup for Firebase:
- **Project ID**: `anonymous-systems-dev`
- **Project Name**: `Anonymous Systems Dev`

Production environment setup for Firebase:
- **Project ID**: `anonymous-systems`
- **Project Name**: `Anonymous Systems`

## Firestore Region
- **Region**: `us-central1`

## Authentication Methods
  - Google

## Security Rules
- Restrict everything not explicitly allowed (default deny).
- `users`: a user reads/writes their own document; admins can read all.
- `categories` / `tags`: public read; create/update by creators, delete by admins.
- `stories` (+ `comments` subcollection): role-based (`owner`/`writer`/`reader`), plus public read
  for published public stories and full read for admins; comments require a public story with
  comments enabled.
- `projects`: public read; admin write.
- The admin app uses the Firebase **Admin SDK** server-side, which bypasses these rules.

## Notes
- **App Check**: Used to protect access to Firebase resources.
- **Authentication**: Enabled for user sign-in.
- **Firestore**: Used for storing user data and application state.
- **Storage**: Used for storing images and other media files.
- **Functions**: Used for authentication operations.