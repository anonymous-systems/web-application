# Production rollout

How to ship to production, and the order to do it in. Written while dev was the
only environment, so it doubles as the list of what must exist before a first
production rollout is possible at all.

> **Current state: production is frozen.** No migration, backfill, or write runs
> against `anonymous-systems` until the app is finished and dev holds the data we
> want. Everything below is the plan for when that changes.

## Environments

| | Project ID | Number |
| --- | --- | --- |
| Development | `anonymous-systems-dev` | 160347575398 |
| Production | `anonymous-systems` | 64613558725 |

### The blocker: everything is hardcoded to dev

There is no way to say "target production" today. These all name the dev project
literally, and each needs an environment-aware form before a production rollout:

- **`.firebaserc`** — one entry, `default: anonymous-systems-dev`. No prod alias.
- **`apps/frontend/apphosting.yaml`** and **`apps/admin/apphosting.yaml`** — every
  `FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_*`, auth domain, storage bucket,
  web app id, measurement id, and reCAPTCHA site key is a dev value.
- **`firebase.json`** — `storage.bucket` is `anonymous-systems-dev.appspot.com`.

CI and the Cypress config also name the dev project, but those stay as they are:
they run entirely against emulators and never touch a live database.

### Making the environment selectable

1. **Project aliases.** Add both to `.firebaserc` so the CLI can be pointed:

   ```jsonc
   { "projects": { "default": "anonymous-systems-dev",
                   "dev":     "anonymous-systems-dev",
                   "prod":    "anonymous-systems" } }
   ```

   Then `firebase use dev` / `firebase use prod`, and `--project <alias>` on any
   one-off command. **Always pass `--project` explicitly for production work**
   rather than relying on the active alias — the active project is invisible
   state, and it is the kind of thing that gets noticed after the write.

2. **App Hosting config per environment.** App Hosting reads `apphosting.yaml`
   and merges an environment-specific `apphosting.<environmentName>.yaml` over
   it, with the environment name set on the backend. The plan is to leave shared
   settings in `apphosting.yaml`, move every dev-specific value into
   `apphosting.dev.yaml`, and add `apphosting.prod.yaml`.
   **Confirm this mechanism in the console before relying on it** — CLI 14.12.0
   exposes no flag for it, so it is configured per-backend rather than at deploy
   time, and it has not been exercised in this repo.

3. **Migration scripts already take an environment.** Every script in
   `apps/admin/scripts/` reads `FIREBASE_PROJECT_ID` and refuses to run against a
   live database without `CONFIRM_PROD=yes`. Nothing to change.

4. **Storage bucket** in `firebase.json` is a single value with no environment
   overlay. The bucket is only used to point the emulator, so the practical fix
   is to leave it on dev and pass the prod bucket where it matters, or split the
   config. Decide before the first prod storage deploy.

### Secrets

Secret Manager entries are per-project, so every `APPHOSTING_*` secret referenced
by the two `apphosting.yaml` files must be **created again in the prod project**
and access granted to the prod backends:

```
firebase apphosting:secrets:set <NAME> --project prod
firebase apphosting:secrets:grantaccess <NAME> --project prod --backend <backendId>
```

One item is not optional: `apps/frontend/apphosting.yaml` carries
`COOKIE_SECRET_CURRENT` / `COOKIE_SECRET_PREVIOUS` **in plaintext, committed to
git**. The admin app already moved these to Secret Manager for exactly this
reason. Production must generate fresh values and reference them as secrets —
never reuse the committed ones, which are public to anyone with repo history.

### Backends

Dev's admin backend is named `web-application` (the console auto-named it from
the repo and it cannot be renamed). Production should be created deliberately as
`admin-web-application` so the name says what it is.

## The rollout order

**Deploy the code that reads both shapes, then migrate the data, then remove the
old shape.** Not the other way round.

This is not a general principle borrowed from elsewhere — it is the lesson from
the taxonomy-references rollout on 2026-08-07. The migration converted dev's
taxonomy links to `DocumentReference`s while dev still served the previous code,
whose mapper cast those fields to `string[]`. The references serialized into the
RSC payload as objects, React could not render an object as a child, and every
page showing a tag threw a client-side exception on hydration. The reading code
already tolerated both shapes; it simply had not been deployed yet.

So, for any change that alters stored shape:

1. Ship the tolerant reader (handles old **and** new shape). Verify in production.
2. Run the migration.
3. Only later, once nothing old remains, remove the fallback.

## Checklist

### Before

- [ ] `pnpm typecheck`, `pnpm lint` (0 errors), `pnpm test`, `pnpm build`
- [ ] `pnpm test:rules`
- [ ] `pnpm test:e2e` — then `git checkout -- test-seed/`, which churns on every
      run and must not be committed
- [ ] Environment targeting from the section above is actually in place
- [ ] Prod App Check: a reCAPTCHA **Enterprise** key registered to the prod web
      apps, with the prod `authDomain` in its allowed domains. A key that is not
      Enterprise, or that does not list the authDomain, fails as
      `auth/internal-error` on sign-in — and a local debug token hides both.
- [ ] Take a Firestore export before any migration (see Migrations below)

### Deploy, in this order

1. **Indexes** — `firebase deploy --only firestore:indexes --project prod`.
   First, because index builds take time and a query against a missing index
   fails outright. `firestore.indexes.json` currently defines field overrides for
   `comments.user` and `reports.status`; composite `indexes` is empty.

2. **Rules** — `firebase deploy --only firestore:rules --project prod` and
   `--only storage:rules`.

   > On dev these are deployed by CI: `.github/workflows/ci.yml` runs the rules
   > specs on every PR, and on merge to `main` publishes rules, indexes and
   > functions — everything App Hosting's build does not ship. That closed the
   > gap where three PRs shipped code depending on rules nobody had deployed,
   > each time looking like an application bug.
   >
   > **Production is not wired up** — the job names `anonymous-systems-dev`
   > explicitly, because there is no prod alias yet. Adding prod here is part of
   > the environment-targeting work above, and until then a prod deploy of any
   > of these is manual.

   ### Deploy permissions

   The deploying identity needs each of these separately — none implies another.
   The Firebase Admin SDK service account carries only the first row by default:

   | Deploy | Required |
   | --- | --- |
   | Firestore rules | `roles/firebase.sdkAdminServiceAgent` |
   | Storage rules | the above **plus** `roles/firebasestorage.admin` |
   | Firestore indexes | `roles/datastore.indexAdmin` |
   | Cloud Functions | `roles/cloudfunctions.admin`, `roles/iam.serviceAccountUser`, `roles/artifactregistry.writer`, `roles/cloudbuild.builds.editor`, `roles/run.admin`, `roles/eventarc.admin` |

   Storage rules are the trap. `roles/storage.admin` looks like it should cover
   them and does not: that is Cloud Storage (`storage.*`), whereas publishing
   rules first resolves which bucket to attach them to, which checks
   `firebasestorage.defaultBucket.get`. Missing it fails the deploy *before* the
   rules are read, so the error names a bucket lookup rather than the rules.

   ```bash
   gcloud projects add-iam-policy-binding <project> \
     --member="serviceAccount:<ci-service-account>" \
     --role="<role>"
   ```

   Functions need the long list because a v2 function is built by Cloud Build,
   stored in Artifact Registry, run on Cloud Run and triggered through Eventarc —
   deploying one touches all four.

   Dev is already granted, on `firebase-adminsdk-1k7kl@anonymous-systems-dev`.
   Production needs the same set on whichever account deploys there — and note
   this is a lot of authority to hang on a downloadable JSON key, since anyone
   holding it can deploy code. Prefer Workload Identity Federation for prod
   rather than minting another long-lived key.

   ### Verifying permissions without a CI run

   Granting roles by trial and error — merge, watch the job fail, grant the next
   one — is how the dev setup took three rounds. Every check below runs locally
   and answers the question before a deploy is attempted.

   **1. Which account does CI actually use?** The secret cannot be read back, but
   a downloaded JSON key is a *user-managed* key, and normally only one account
   has any:

   ```bash
   gcloud iam service-accounts list --project <project> --format="value(email)" \
     | tr -d '\r' | while read -r sa; do
       n=$(gcloud iam service-accounts keys list --iam-account="$sa" \
             --project <project> --format="value(keyType)" \
           | tr -d '\r' | grep -c USER_MANAGED)
       echo "$n user-managed  $sa"
     done
   ```

   **2. What does it already hold?**

   ```bash
   gcloud projects get-iam-policy <project> \
     --flatten="bindings[].members" \
     --format="value(bindings.members,bindings.role)" \
     | tr -d '\r' | grep "<service-account>" | awk '{print $2}' | sort
   ```

   **3. Does a role actually contain the permission an error named?** Role titles
   mislead — this is how `roles/storage.admin` was mistaken for the one covering
   Storage rules:

   ```bash
   gcloud iam roles describe roles/firebasestorage.admin \
     --format="value(includedPermissions)" \
     | tr ';' '\n' | grep firebasestorage.defaultBucket.get
   ```

   **4. Is a 403 really permission, or a resource that does not exist?** Google
   returns the same 403 for both — the message says "or it may not exist". Call
   the failing endpoint as an owner: a 200 means the resource is fine and the
   problem is genuinely IAM.

   ```bash
   TOKEN=$(gcloud auth print-access-token | tr -d '\r\n')
   curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $TOKEN" <url>
   ```

   **5. Test as the service account itself.** Impersonation answers "will CI
   work" directly, and grants take a minute or two to propagate — so a 403
   straight after granting is usually not a wrong role:

   ```bash
   TOKEN=$(gcloud auth print-access-token \
     --impersonate-service-account=<service-account> | tr -d '\r\n')
   curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $TOKEN" <url>
   ```

   **6. Run the real deploy as the service account.** The strongest check: build
   an impersonated ADC file and point firebase-tools at it, then dry-run every
   target. This is what proved all three CI steps before re-running the job.

   ```jsonc
   // impersonated-adc.json — source_credentials is your own ADC, verbatim
   {
     "type": "impersonated_service_account",
     "service_account_impersonation_url":
       "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/<sa>:generateAccessToken",
     "source_credentials": { /* contents of application_default_credentials.json */ },
     "delegates": []
   }
   ```

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/impersonated-adc.json
   pnpm exec firebase deploy --only firestore:rules,storage --project <project> \
     --non-interactive --dry-run
   pnpm exec firebase deploy --only firestore:indexes --project <project> \
     --non-interactive --dry-run
   pnpm exec firebase deploy --only functions --project <project> \
     --non-interactive --dry-run
   ```

   **Delete that file afterwards** — it embeds your own refresh token, so it is
   as sensitive as a downloaded key. `--dry-run` writes nothing but does enable
   APIs on the target project, which is worth knowing before pointing it at
   production.

   Two shell traps cost time while working this out, both on Windows:
   `$(gcloud ... 2>&1)` folds gcloud's impersonation warning into the token and
   the request 401s, so capture stdout only; and `gcloud` output carries `\r`,
   which silently breaks `--iam-account="$sa"` in a loop. Hence the `tr -d '\r'`
   above.

3. **Functions** — `firebase deploy --only functions --project prod`. If a
   function changes trigger type (HTTPS ↔ background), the deploy is rejected;
   delete the old function first, then deploy.

4. **App Hosting backends** — push to `main`, or force a rollout:
   `firebase apphosting:rollouts:create <backendId> --git-branch main --project prod`.

   > App Hosting **silently skips** a build when nothing under that backend's
   > `rootDir` changed. A rollout reported as SKIPPED is not a failure and not a
   > success — it means the backend is still serving the previous revision.
   > Always confirm the deployed revision rather than the rollout status.

### Migrations

Run **after** the code that reads the new shape is live, and only then. Order
matters — `migrate:taxonomy-links` resolves terms by name and slug, so
`migrate:taxonomy` must have backfilled those first.

| Order | Script | What it does |
| --- | --- | --- |
| 1 | `migrate:stories` | Legacy story shape → current model |
| 2 | `migrate:projects` | Legacy project shape → current model |
| 3 | `migrate:taxonomy` | Backfills `name`, renames timestamps, drops `stories` |
| 4 | `migrate:taxonomy-links` | Story/project taxonomy links → references |

Every script is idempotent and supports `DRY_RUN=yes`. For each one:

```bash
# 1. Export production first — this is the rollback.
gcloud firestore export gs://<bucket>/pre-migration-$(date +%F) --project anonymous-systems

# 2. Dry-run against a copy of that export in the emulator.
firebase emulators:exec --only firestore --import=./dump \
  "DRY_RUN=yes pnpm --filter admin migrate:<name>"

# 3. Run against the copy and inspect the result.
firebase emulators:exec --only firestore --import=./dump --export-on-exit=./migrated \
  "pnpm --filter admin migrate:<name>"

# 4. Dry-run against production and read every line of output.
DRY_RUN=yes CONFIRM_PROD=yes FIREBASE_PROJECT_ID=anonymous-systems \
  pnpm --filter admin migrate:<name>

# 5. Run it.
CONFIRM_PROD=yes FIREBASE_PROJECT_ID=anonymous-systems \
  pnpm --filter admin migrate:<name>

# 6. Re-run the dry run. It must report zero changes.
```

Step 6 is the idempotency check and it is worth the extra minute: a migration
that still reports work after completing has not finished, and the difference
between "0 of N" and "3 of N" is the whole signal.

#### What production holds that dev did not

- **78 tags, none with a `name`.** Dev had 12 with 8 unnamed. `migrate:taxonomy`
  derives names from slugs, so `google-cloud-run` becomes "Google Cloud Run" —
  but `ssr` becomes "Ssr". **Review and fix acronyms in admin afterwards.**
  Renaming is now safe: it no longer moves the slug or orphans content.
- **`migrate:taxonomy-links` creates terms.** Where content names a tag that was
  never created, the migration creates it rather than dropping the link. On dev
  that was 6 tags. Expect more on prod, and review the new entries.
- **The owner uid differs from dev.** Anything assuming a uid must be
  parameterised, not copied.

### After

- [ ] Both backends serve the expected revision (not a SKIPPED rollout)
- [ ] Sign in to the admin app — this exercises App Check end to end
- [ ] Load a story detail page and the portfolio list. These are the two surfaces
      that render taxonomy, so they break first when links are wrong. Check the
      **browser console**, not just the status code: a hydration failure returns
      200 with correct-looking HTML.
- [ ] Confirm a published story, a draft, and a private one — drafts and private
      content must not be reachable
- [ ] Re-run each migration's dry run; all must report zero

## Verifying against real data

An emulator run cannot prove the production read path works: the emulator ignores
App Check, and App Check is **enforced** on Firestore and identitytoolkit. This is
already noted in `packages/firebase-config/server-firestore.ts`.

To exercise the real path locally, run an app with the emulator variables cleared
so it uses the live database and mints a real App Check token from admin
credentials:

```bash
cd apps/frontend
FIRESTORE_EMULATOR_HOST= FIREBASE_AUTH_EMULATOR_HOST= FIREBASE_STORAGE_EMULATOR_HOST= \
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST= NEXT_PUBLIC_AUTH_EMULATOR_HOST= NEXT_PUBLIC_STORAGE_EMULATOR_HOST= \
pnpm exec next dev -p 3300
```

Then fetch a page and inspect the RSC payload rather than trusting the status
code. A raw reference leaking into the payload looks like this, and is what a
shape mismatch produces:

```
"children":["#",{"type":"firestore/documentReference/1.0","referencePath":"tags/docker"}]
```

## Rollback

- **Code** — redeploy the previous commit:
  `firebase apphosting:rollouts:create <backendId> --git-commit <sha> --project prod`.
- **Rules** — redeploy from the previous commit. There is no rules history in the
  CLI; git is the history.
- **Data** — restore the export taken before the migration. This is why the
  export is step 1 and not optional. Note that a Firestore import does **not**
  delete documents created since the export.

Prefer rolling the code forward to match the data over reversing a migration.
Reverse migrations are new, untested code written under pressure.
