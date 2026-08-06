/**
 * Up-to-two-letter uppercase initials from a display name, e.g. "Ada Comment" →
 * "AC". Returns an empty string for an unknown author, so avatar fallbacks
 * render blank rather than a stray placeholder letter.
 */
export const initialsFrom = (name: string | null | undefined): string =>
  (name ?? '')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
