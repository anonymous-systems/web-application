/**
 * Returns a CSS animation timing function that represents an emphasized
 * accelerate animation.
 *
 * @param timing - The duration and delay of the animation.
 * Can be a string in the format "duration delay" (e.g., "400ms 100ms")
 * or a number representing the duration in milliseconds.
 * Defaults to 200ms.
 *
 * @returns A CSS animation timing function string.
 *
 * @example
 * ```typescript
 * import { emphasizedAccelerate } from '@shared-library/animations';
 *
 * // "500ms 200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)"
 * const animation = emphasizedAccelerate('500ms 200ms');
 *
 * // "600ms cubic-bezier(0.3, 0.0, 0.8, 0.15)"
 * const animation = emphasizedAccelerate(600);
 * ```
 */
export const emphasizedAccelerate = (
    timing: string | number = 200,
) => {
  const timingFunction = 'cubic-bezier(0.3, 0.0, 0.8, 0.15)';

  if (typeof timing === 'string') {
    return `${timing} ${timingFunction}`;
  }

  const milliseconds = `${timing}ms`;

  return `${milliseconds} ${timingFunction}`;
};
