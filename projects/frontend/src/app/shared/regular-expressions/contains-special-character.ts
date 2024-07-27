/**
 * Regular expression to check if a string contains at least one special
 * character.
 *
 * This regular expression uses a positive lookahead assertion `(?=...)`
 * to check if the string contains any non-word character
 * (anything that's not a letter, digit, or underscore).
 *
 * @example
 * const string1 = "Hello world!";
 * const string2 = "abcdef";
 * const string3 = "password123$";
 *
 * containsSpecialCharacterRegExp.test(string1); // true
 * containsSpecialCharacterRegExp.test(string2); // false
 * containsSpecialCharacterRegExp.test(string3); // true
 */
const containsSpecialCharacterRegExp = /(?=.*[\W])/;
