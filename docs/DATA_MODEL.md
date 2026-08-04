# Data Model

## Overview
The data model for the Anonymous Systems app is stored in **Firestore**, with
binary assets in **Firebase Storage**. Timestamps are Firestore `Timestamp`s;
the admin app serialises them to ISO strings when reading for the client.

## Collections and Documents

### Users — `users/{userId}`
- `avatar`: _string_ or _null_ — URL of the user's avatar image
- `firstName`: _string_ — User's first name
- `lastName`: _string_ — User's last name
- `username`: _string_ — Unique username for the user

Auth data (email, display name, admin/creator custom claims) lives in Firebase
Auth, not the profile document.

### Stories — `stories/{storyId}`
The app's primary content type, authored in the admin app.
- `title`: _string_
- `slug`: _string_ — URL-safe, derived from the title
- `type`: _'article' | 'blog' | 'snippet' | 'problem'_
- `status`: _'draft' | 'published' | 'pending'_ (`pending` reserved for a future
  creator-submission flow)
- `visibility`: _'public' | 'private'_
- `excerpt`: _string_ or _null_ — short summary for cards/SEO
- `content`: _string_ or _null_ — rich-text **HTML** from CKEditor 5
- `coverImage`: _string_ or _null_ — Storage download URL
- `category`: _string_ or _null_ — a category slug
- `tags`: _string[]_ — tag slugs
- `allowComments`: _boolean_
- `featured`: _boolean_
- `problemStatus`: _'open' | 'resolved'_ or _null_ (only for `type: 'problem'`)
- `readTimeMinutes`: _number_ or _null_ — computed from content
- `user`: _DocumentReference_ → `users/{ownerId}`
- `roles`: _map_ — `{ [uid]: 'owner' | 'writer' | 'reader' }`
- `createdAt`, `updatedAt`, `publishedAt`: _Timestamp_

> Legacy stories from the previous app used a different shape (`byline`, `image`,
> `categories[]`, `created/updated/published`, denormalised `author`). They are
> converted by `apps/admin/scripts/migrate-stories.ts` — see its header.

#### Comments — `stories/{storyId}/comments/{commentId}`
- `content`: _string_
- `user`: _DocumentReference_ → `users/{uid}` (author)
- `createdAt`, `updatedAt`: _Timestamp_

### Categories — `categories/{categoryId}` and Tags — `tags/{tagId}`
Shared taxonomy shape, managed in the admin app:
- `name`: _string_
- `slug`: _string_ — unique within the collection
- `description`: _string_ or _null_
- `createdAt`, `updatedAt`: _Timestamp_

### Projects — `projects/{projectId}`
Portfolio entries (admin-managed). Shape TBD as the Portfolio section is built.

## Storage
- **User avatars** — the user's uploaded avatar image.
- **Story covers** — `story-covers/{uuid}.{ext}`, uploaded via the admin app
  (Admin SDK) and referenced by `stories.coverImage`.
- The admin **Files** section browses and manages the whole bucket (list / upload /
  rename / move / delete) via Admin SDK server actions. Folders are virtual (path
  prefixes); empty ones are kept alive by a zero-byte `.keep` placeholder.
