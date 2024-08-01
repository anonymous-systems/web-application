/**
 * Requires at least one of the specified keys to be present in the object.
 *
 * @example
 * type Person = RequireAtLeastOne<
 *  { name?: string, displayName?: string },
 *  'name' | 'displayName'
 * >;
 *
 * // Valid:
 * const person1: Person = { name: 'John Doe' };
 * const person2: Person = { displayName: 'Jane Doe' };
 *
 * // Invalid:
 * // Error: Missing required property 'name' or 'displayName'
 * const person3: Person = {};
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    // eslint-disable-next-line max-len
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys];
