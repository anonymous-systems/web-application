# @workspace/ui

Shared UI component library for the monorepo, built on [shadcn/ui](https://ui.shadcn.com)
(new-york style) + Tailwind CSS. Consumed by `apps/frontend` and `apps/admin`.

## Where components live

- **shadcn primitives** → `src/components/` (e.g. `button.tsx`, `dialog.tsx`), imported
  anywhere via `@workspace/ui/components/<name>`.
- The package exports `./components/*`, `./hooks/*`, `./lib/*`, `./assets/*`, and `./models/*`,
  so new files under those folders are importable with no manual export step.
- App-specific, composed components stay in the app itself (`apps/*/components`, alias
  `@/components`) — not here.

## Adding a shadcn component

Run the shadcn CLI against one of the apps. Its `components.json` maps the `ui` alias to this
package, so the primitive is written into `packages/ui/src/components/`:

```bash
pnpm dlx shadcn@latest add <component> -c apps/frontend
# e.g.
pnpm dlx shadcn@latest add table -c apps/frontend
```

Then import it from any app:

```ts
import { Table } from '@workspace/ui/components/table'
```

### Caveat: dependencies

The CLI may add npm deps (e.g. `@radix-ui/*`) to the app you targeted. Since the component
lives here, those deps belong in `packages/ui/package.json` — move them there if the CLI put
them in the app, then re-run `pnpm install`.
