# Key Decisions Log

## Tech Stack
Framework: Next.js,
Backend: Firebase,
UI Library: shadcn/ui and Tailwind CSS,
WYSIWYG Editor: CKEditor 5,
and Hosting: Firebase App Hosting
- **Date**: 2025-07-16
- **Reason**: Next.js provides server-side rendering and static site generation,
  Firebase offers real-time database and authentication, 
  shadcn/ui and Tailwind CSS provide a modern UI,
  CKEditor 5 is a powerful WYSIWYG editor,
  and Firebase App Hosting is reliable for hosting the application.

## Authentication
- **Method**: Firebase Authentication
- **Date**: 2025-07-19
- **Reason**: Firebase Authentication is easy to integrate with Next.js and provides
  secure authentication methods including Google.

## User Onboarding
- **Method**: Users are restricted from accessing any private routes until they
  successfully complete the onboarding process.
- **Date**: 2025-07-26
- **Reason**: This approach ensures users are informed about platform rules, enhances
  personalization, and improves overall user experience. Onboarding requires acceptance
  of the terms of service and privacy policy, as well as providing a profile picture and
  username. Attempting to access private routes without completing onboarding will
  automatically redirect users to the onboarding page.

## Cypress for E2E Testing
- **Method**: Cypress for end-to-end testing
- **Date**: 2025-08-06
- **Reason**: Cypress is a powerful testing framework that allows for easy setup and
  provides a rich set of features for testing web applications. It integrates well with
  Next.js and Firebase, making it suitable for our project.

## Firebase App Hosting
- **Method**: Firebase App Hosting for deployment
- **Date**: 2025-08-09
- **Reason**: Firebase App Hosting is a reliable and scalable hosting solution that
  integrates seamlessly with Firebase services. It provides fast content delivery and
  easy deployment, making it ideal for our Next.js application.

## Stories: authoring location, editor, model & migration
- **Method**: Story authoring/management lives in the **admin app** for now (creators may author on
  the frontend later — the `stories/{id}` rules already allow it, and the Story model + Zod schema
  live in `packages/ui/src/models/` for reuse, so no rework). WYSIWYG via a **fresh, latest CKEditor 5
  + @ckeditor/ckeditor5-react** integration (not the old v35 Angular build). A **clean, conventional
  Story model** replaces the legacy `anonsys.tech` shape (`excerpt`, `coverImage`, single `category`
  + `tags[]`, `createdAt/updatedAt/publishedAt`, author resolved from the `user` ref). Existing
  legacy stories are converted by a **one-time idempotent migration before go-live**.
- **Date**: 2026-08-02
- **Reason**: Only the user authors today (YAGNI → admin-only now, designed so frontend authoring
  needs no rework). The legacy model was written early "while learning"; a clean model + migration
  beats carrying non-conventional fields forward.

## File Manager: Admin SDK server actions
- **Method**: The admin Files section is a Firebase Storage browser built on **Admin SDK server
  actions** (list / upload / new-folder / delete / rename / move / download-URL), guarded by
  `ensureAdmin` — not the client SDK. Ported from the user's Angular
  `angular-firebase-storage-manager` with improvements (single-call listing via `getFiles` inline
  metadata, persistent empty folders via a `.keep` placeholder, rename/move, in-folder search + sort).
- **Date**: 2026-08-02
- **Reason**: Matches the app's server-action architecture (like the story cover upload), needs no
  client storage-rules for admin access, and keeps the browser bundle lean. The Angular version was an
  early-learning build, so rebuilding on the current stack modernizes and improves it.

## Portfolio (Projects): admin CRUD, model, and Technologies taxonomy
- **Method**: The **Portfolio** section manages **Projects** (`projects/{id}`) with a clean model that
  mirrors Story (admin authoring, `user` ref + roles, status/visibility, cover upload, rich-text content
  via the shared balloon-block editor), plus project-specific fields: `technologies[]`, source/live/figma
  links, and `developmentStatus`. **Technologies are their own taxonomy** (a third instance of the generic
  Categories/Tags pattern), not folded into Tags. The public YouTube-style showcase (modelled on the
  user's `aaronjonesii` site) is a later `apps/frontend` task; this ships the admin CRUD it will consume.
  The admin Comments moderation was generalized to cover project comments too.
- **Date**: 2026-08-04
- **Reason**: Consistency with Stories (shared editor/cover/patterns → reuse). Tags are free editorial
  labels; technologies are a controlled stack the showcase renders distinctly and can later gain an
  `icon`/`url` — and a third taxonomy instance is nearly free.
- **Migration**: The `aaronjonesii` repo is only a UI reference (a separate project, not the data source).
  The production `projects` data comes from the old **anonsys.tech** portfolio, so it's migrated in place
  like Stories (`scripts/migrate-projects.ts`): `name→title`, `description→excerpt`, `images[0]→coverImage`,
  `link→livePreviewLink`, `github→sourceCodeLink`, `order` dropped, defaulting to published/public and
  adding timestamps + owner. Validate on a copy of prod first.
- **Security rules** (`firestore.rules`): `technologies` mirrors Tags (public read, creator write). `projects`
  mirrors Stories' role-based access, but public read is gated on **`published` AND `public`** (stricter than
  Stories, which gates on visibility only) so drafts/archived stay private; project comments mirror story
  comments.