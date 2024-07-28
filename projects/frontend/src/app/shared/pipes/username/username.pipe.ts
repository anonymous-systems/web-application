import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'username', standalone: true })
export class UsernamePipe implements PipeTransform {
  /**
   * Transforms an input string into a valid username format.
   *
   * @param {string} input - The input string to be transformed.
   * @returns {string} The normalized username:
   *      - Converted to lowercase.
   *      - Spaces replaced with hyphens.
   *      - Stripped of non-alphanumeric characters (except hyphens).
   */
  transform(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
