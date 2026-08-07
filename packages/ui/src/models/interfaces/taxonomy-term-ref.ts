/**
 * A taxonomy term as content refers to it, resolved for display.
 *
 * Content links to terms by document id, not by slug: a slug is a projection of
 * a human-readable name, and using it as the key made referential integrity
 * depend on nobody ever renaming anything. Renaming a term used to silently
 * orphan every reference to it.
 *
 * `id` is the link. `slug` is the URL segment and remains free to change;
 * `name` is what a reader sees.
 */
export interface TaxonomyTermRef {
  id: string
  name: string
  slug: string
}
