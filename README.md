# Anonymous Systems Web Application


This repository contains the codebase for the Anonymous Systems web application,
organized as a monorepo with both frontend and backend projects.
The stack includes React, TypeScript, Tailwind CSS, shadcn/ui, and Firebase.
The frontend is customer-facing, while the backend serves administrative functions.

## Project Structure

- **Frontend:** Located in `apps/frontend`. Contains all customer-facing UI code.
- **Backend:** Located in `apps/admin`. Contains admin-facing backend services.

## Development Setup

### Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c packages/ui
```

This will place the ui components in the `packages/ui/src/components` directory.
But you may have to update the code to conform to eslint rules and TypeScript types.

### Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```

### Running the app
To run the app, use the following command:

```bash
pnpm dev
```


## 🤝 Feedback & Support

Have feedback, suggestions, or need help?
Email me at [aaron.jones@anonsys.tech](mailto:aaron.jones@anonsys.tech)


License: [MIT](https://choosealicense.com/licenses/mit/)