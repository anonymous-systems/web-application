import { PipeTransform } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FormatBytesPipe implements PipeTransform {
    /**
     * Formats a number by adding commas as thousands separators and
     * limiting to two decimal places.
     *
     * @param {number} num - The number to format.
     * @return {string} The formatted number as a string.
     */
    formatNumber(num: number): string;
    /**
     * Converts a number of bytes into a human-readable format with units
     * (e.g., kB, MB, GB).
     *
     * @param {number} bytes - The number of bytes.
     * @return {string} The formatted byte size representation.
     */
    formatBytes(bytes: number): string;
    /**
     * Transforms a value representing bytes into a human-readable formatted
     * string. Accepts both numbers and strings as input.
     *
     * @param {string | number} bytes - The byte value to transform.
     * @return {string} The formatted string representing the byte size.
     */
    transform(bytes: string | number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormatBytesPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<FormatBytesPipe, "formatBytes", true>;
}
