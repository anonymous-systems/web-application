/**
 * Returns a CSS animation timing function that represents an emphasized
 * decelerate animation.
 *
 * @param timing - The duration and delay of the animation.
 * Can be a string in the format "duration delay" (e.g., "400ms 100ms")
 * or a number representing the duration in milliseconds.
 * Defaults to "400ms 100ms".
 *
 * @returns A CSS animation timing function string.
 *
 * @example
 * ```typescript
 * import { emphasizedDelecelerate } from '@shared-library/animations';
 *
 * // "500ms 200ms cubic-bezier(0.05, 0.7, 0.1, 1.0)"
 * const animation = emphasizedDelecelerate('500ms 200ms');
 *
 * // "600ms cubic-bezier(0.05, 0.7, 0.1, 1.0)"
 * const animation = emphasizedDelecelerate(600);
 * ```
 */
export const emphasizedDelecelerate = (
    timing: string | number = '400ms 100ms',
) => {
  const timingFunction = 'cubic-bezier(0.05, 0.7, 0.1, 1.0)';

  if (typeof timing === 'string') {
    return `${timing} ${timingFunction}`;
  }

  const milliseconds = `${timing}ms`;

  return `${milliseconds} ${timingFunction}`;
};
