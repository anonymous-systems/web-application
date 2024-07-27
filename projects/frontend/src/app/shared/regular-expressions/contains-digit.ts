/**
 * Regular expression to check if a string contains at least one digit (0-9).
 *
 * This regular expression uses a positive lookahead assertion `(?=...)`
 * to check if the string contains any numerical digit anywhere within it.
 *
 * @example
 * const string1 = "Hello world 123";
 * const string2 = "abcdef";
 * const string3 = "phone123-456-7890";
 *
 * containsDigitRegExp.test(string1); // true
 * containsDigitRegExp.test(string2); // false
 * containsDigitRegExp.test(string3); // true
 */
const containsDigitRegExp = /(?=.*\d)/;
