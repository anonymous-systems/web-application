import {
  DocumentReference,
  FieldValue,
  type Firestore,
} from 'firebase-admin/firestore'
import { TAXONOMY_COLLECTIONS } from './apply-taxonomy-migrations'
import {
  missingTerms,
  planTaxonomyLinks,
  type MissingTerm,
  type PlannedLink,
  type TermIndex,
} from './taxonomy-link-migration'

/** The collections whose taxonomy links this migrates. */
export const LINKED_COLLECTIONS = ['stories', 'projects'] as const

export interface LinkMigrationResult {
  total: number
  migrated: number
  /** Terms created so content had something to point at. */
  created: MissingTerm[]
  warnings: string[]
}

/** Every taxonomy term, keyed by both slug and id so either form of link resolves. */
export const buildTermIndex = async (db: Firestore): Promise<TermIndex> => {
  const index: TermIndex = new Map()

  for (const collection of TAXONOMY_COLLECTIONS) {
    const snapshot = await db.collection(collection).get()
    const terms = new Map<string, string>()

    for (const doc of snapshot.docs) {
      terms.set(doc.id, doc.id)
      const slug = doc.data().slug as string | undefined
      if (slug) terms.set(slug, doc.id)
    }

    index.set(collection, terms)
  }

  return index
}

const termKey = (term: MissingTerm): string => `${term.collection}/${term.slug}`

/**
 * Every term named by content but never created, deduplicated across documents
 * so two projects sharing a tag get one term rather than two.
 */
const collectMissingTerms = async (
  db: Firestore,
  index: TermIndex
): Promise<MissingTerm[]> => {
  const byKey = new Map<string, MissingTerm>()

  for (const collection of LINKED_COLLECTIONS) {
    const snapshot = await db.collection(collection).get()
    for (const doc of snapshot.docs) {
      for (const term of missingTerms(doc.data(), index)) {
        if (!byKey.has(termKey(term))) byKey.set(termKey(term), term)
      }
    }
  }

  return [...byKey.values()]
}

/**
 * Creates the missing terms and adds them to the index.
 *
 * A dry run indexes them under a stand-in id rather than skipping them, so the
 * planning that follows sees the collection the real run would produce and its
 * warnings mean the same thing in both modes.
 */
const createTerms = async (
  db: Firestore,
  missing: MissingTerm[],
  index: TermIndex,
  dryRun: boolean
): Promise<void> => {
  for (const term of missing) {
    const now = FieldValue.serverTimestamp()
    const id = dryRun
      ? term.slug
      : (
          await db.collection(term.collection).add({
            name: term.name,
            slug: term.slug,
            description: null,
            createdAt: now,
            updatedAt: now,
          })
        ).id

    const terms = index.get(term.collection)
    terms?.set(term.slug, id)
    terms?.set(id, id)
  }
}

const toStoredValue = (
  db: Firestore,
  link: PlannedLink
): DocumentReference | string =>
  'id' in link ? db.collection(link.collection).doc(link.id) : link.unresolved

/**
 * Rewrites slug-based taxonomy links as references across stories and projects.
 *
 * Runs in two phases on purpose: every term the content names is created first,
 * so the rewrite resolves everything or says what it could not — rather than
 * dropping half a tag row because a term happened to be missing when the
 * document referencing it was reached.
 *
 * Idempotent — documents already holding references are skipped, so a re-run
 * after a partial pass finishes the rest.
 */
export const applyTaxonomyLinks = async (
  db: Firestore,
  options: { dryRun?: boolean } = {}
): Promise<LinkMigrationResult> => {
  const dryRun = options.dryRun ?? false
  const index = await buildTermIndex(db)
  const created = await collectMissingTerms(db, index)
  await createTerms(db, created, index, dryRun)

  const warnings: string[] = []
  let total = 0
  let migrated = 0

  for (const collection of LINKED_COLLECTIONS) {
    const snapshot = await db.collection(collection).get()
    total += snapshot.size

    for (const doc of snapshot.docs) {
      const plan = planTaxonomyLinks(doc.data(), index)
      plan.warnings.forEach((warning) =>
        warnings.push(`${collection}/${doc.id}: ${warning}`)
      )
      if (!plan.changed) continue
      migrated += 1

      if (dryRun) continue

      const update: Record<string, unknown> = {}
      for (const [field, link] of Object.entries(plan.set)) {
        update[field] = Array.isArray(link)
          ? link.map((entry) => toStoredValue(db, entry))
          : toStoredValue(db, link)
      }

      await doc.ref.update(update)
    }
  }

  return { total, migrated, created, warnings }
}
