# Anonymous Systems Web Application

This repo contains the code for the Anonymous Systems' web application with
a monorepo structure for both frontend and backend. Both
applications are built using React, TypeScript, Tailwind CSS, shadcn/ui, and
Firebase as the backend service. The frontend is customer-facing, while the
backend is admin-facing.

## Frontend

Frontend code is located in the `apps/frontend` directory.
The frontend is customer facing and contains all user interface code.

## Backend

Backend code is located in the `apps/admin` directory.
The backend is admin facing and contains all backend services.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c packages/ui
```

This will place the ui components in the `packages/ui/src/components` directory.
But you may have to update the code to conform to eslint rules and TypeScript types.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Running the app
To run the app, use the following command:

```bash
pnpm dev
```


## 🤝 Feedback & Support

Have feedback, suggestions, or need help?
Email me at [aaron.jones@anonsys.tech](mailto:aaron.jones@anonsys.tech)


License: [MIT](https://choosealicense.com/licenses/mit/)