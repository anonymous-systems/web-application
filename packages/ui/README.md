# @workspace/ui

Shared UI component library for the monorepo, built on [shadcn/ui](https://ui.shadcn.com)
(new-york style) + Tailwind CSS. Consumed by `apps/frontend` and `apps/admin`.

## Where components live

- **Pristine shadcn primitives** → `src/components/*.tsx` (e.g. `button.tsx`, `dialog.tsx`),
  imported via `@workspace/ui/components/<name>`. These are kept **exactly as the registry
  ships them** — never hand-edit — so re-pulling a newer version is a clean, conflict-free
  overwrite.
- **Our customizations** → `src/components/custom/*.tsx`. When we need to change a primitive's
  behavior or styling, we do it in a thin **wrapper** that composes the pristine primitive,
  keeping the same export name. Apps import the customized version from
  `@workspace/ui/components/custom/<name>`. This folder is the single, discoverable list of
  what we've customized.
- The package exports `./components/*`, `./hooks/*`, `./lib/*`, `./assets/*`, and `./models/*`,
  so new files (including nested `custom/`) are importable with no manual export step.
- App-specific, composed components stay in the app itself (`apps/*/components`, alias
  `@/components`) — not here.

## Customizing a component (the wrapper pattern)

Keep the primitive pristine; put the customization in `components/custom/`:

```ts
// components/custom/button.tsx
import { Button as BaseButton } from '../button'
// ...compose BaseButton, add props/styling, re-export as `Button`
```

Then apps import `@workspace/ui/components/custom/button` instead of `.../components/button`.

**Current custom wrappers:**

- `custom/button` — pill shape, pointer cursor, and a `loading` prop over the pristine button.

**Hand-authored components (not from the registry):** `brand-name`, `divider`,
`loading-spinner`, `nav`, `theme-toggle`, `three-d-sphere`. These aren't shadcn primitives, so
the CLI never touches them; they live in `components/` alongside the primitives.

## Updating primitives to the latest

Preview drift, then overwrite and reconcile:

```bash
pnpm dlx shadcn@latest diff <component> -c packages/ui        # preview
pnpm dlx shadcn@latest add <component> -c apps/frontend --overwrite
pnpm lint:fix   # normalize quotes to the repo style
```

Because primitives carry no customizations, the only expected diff is the registry's own
changes. Verify **both** apps build (`pnpm build`) since `packages/ui` is shared. Components use
the single **`radix-ui`** package (not individual `@radix-ui/react-*`).

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

The CLI may add npm deps to the app you targeted. Since the component lives here, those deps
belong in `packages/ui/package.json` — move them there if the CLI put them in the app, then
re-run `pnpm install`. Radix-based primitives use the single `radix-ui` package, which is
already a dependency here.
