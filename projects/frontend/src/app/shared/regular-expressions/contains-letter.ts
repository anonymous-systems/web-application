/**
 * Regular expression to check if a string contains at least one letter
 * (a-z or A-Z).
 *
 * This regular expression uses a positive lookahead assertion `(?=...)`
 * to check if the string contains any alphabetical characters anywhere
 * within it.
 *
 * @example
 * const string1 = "Hello world";
 * const string2 = "123";
 * const string3 = "123abc";
 *
 * containsLetterRegExp.test(string1); // true
 * containsLetterRegExp.test(string2); // false
 * containsLetterRegExp.test(string3); // true
 */
export const containsLetterRegExp = /(?=.*[a-zA-Z])/;
