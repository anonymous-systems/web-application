import { Pipe, PipeTransform } from '@angular/core';
import { stringToUsername } from "../../fns";

@Pipe({ name: 'username', standalone: true })
export class UsernamePipe implements PipeTransform {
  /**
   * Transforms an input string into a valid username format.
   *
   * @param {string} input - The input string to be transformed.
   * @returns {string} The normalized username
   *
   * @see stringToUsername
   */
  transform(input: string): string {
    if (typeof input !== 'string') return '';

    return stringToUsername(input);
  }
}
