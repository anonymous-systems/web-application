/** Uppercases the first character of a string (e.g. `'draft'` → `'Draft'`). */
export const titleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)
