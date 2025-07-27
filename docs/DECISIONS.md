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