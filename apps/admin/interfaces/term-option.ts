/**
 * A taxonomy term as offered by a form's picker.
 *
 * `id` is what gets stored — content links to the term document, so a rename
 * cannot strand it. `slug` is carried only so the e2e specs can address a chip
 * by a stable, readable handle rather than a generated id.
 */
export interface TermOption {
  id: string
  name: string
  slug: string
}
