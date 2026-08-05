/** Up-to-two-letter uppercase initials from a display name, e.g. "Ada Comment" → "AC". */
export const initialsFrom = (name: string): string =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
