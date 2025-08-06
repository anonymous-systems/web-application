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
- Restrict everything not explicitly allowed.
- Read and write access to the `users` collection is limited to the authenticated user.

## Notes
- **App Check**: Used to protect access to Firebase resources.
- **Authentication**: Enabled for user sign-in.
- **Firestore**: Used for storing user data and application state.
- **Storage**: Used for storing images and other media files.
- **Functions**: Used for authentication operations.