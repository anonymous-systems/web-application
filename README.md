# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/frontend
```

This will place the ui components in the `packages/ui/src/components` directory.
But you may have to move the added dependencies to the 'packages/ui' directory manually.

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