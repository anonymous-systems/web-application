/**
 * Converts an input string into a valid username format.
 *
 * @param {string} input - The input string to be transformed.
 * @returns {string} The normalized username:
 *      - Converted to lowercase.
 *      - Spaces replaced with hyphens.
 *      - Stripped of non-alphanumeric characters (except hyphens).
 */
export const stringToUsername = (input: string) => {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
