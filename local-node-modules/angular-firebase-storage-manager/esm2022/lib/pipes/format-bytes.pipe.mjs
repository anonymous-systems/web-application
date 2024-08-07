import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class FormatBytesPipe {
    // This has been copied and slightly modified from firebase-tools-ui
    // https://github.com/firebase/firebase-tools-ui/blob/8ad31d748f687bbb04b838430c460121f9a8e338/src/components/common/formatBytes.ts
    /**
     * Formats a number by adding commas as thousands separators and
     * limiting to two decimal places.
     *
     * @param {number} num - The number to format.
     * @return {string} The formatted number as a string.
     */
    formatNumber(num) {
        const parts = num.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (+parts[1] === 0) {
            return parts[0];
        }
        return parts.join('.');
    }
    /**
     * Converts a number of bytes into a human-readable format with units
     * (e.g., kB, MB, GB).
     *
     * @param {number} bytes - The number of bytes.
     * @return {string} The formatted byte size representation.
     */
    formatBytes(bytes) {
        const threshold = 1024;
        if (Math.round(bytes) < threshold) {
            return bytes + ' B';
        }
        const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let u = -1;
        let formattedBytes = bytes;
        do {
            formattedBytes /= threshold;
            u++;
        } while (Math.abs(formattedBytes) >= threshold && u < units.length - 1);
        return this.formatNumber(formattedBytes) + ' ' + units[u];
    }
    /**
     * Transforms a value representing bytes into a human-readable formatted
     * string. Accepts both numbers and strings as input.
     *
     * @param {string | number} bytes - The byte value to transform.
     * @return {string} The formatted string representing the byte size.
     */
    transform(bytes) {
        if (typeof bytes === 'string')
            bytes = Number(bytes);
        return this.formatBytes(bytes);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FormatBytesPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.1.3", ngImport: i0, type: FormatBytesPipe, isStandalone: true, name: "formatBytes" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FormatBytesPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'formatBytes',
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LWJ5dGVzLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWZpcmViYXNlLXN0b3JhZ2UtbWFuYWdlci9zcmMvbGliL3BpcGVzL2Zvcm1hdC1ieXRlcy5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQWdCLE1BQU0sZUFBZSxDQUFDOztBQU1sRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixvRUFBb0U7SUFFcEUsbUlBQW1JO0lBQ25JOzs7Ozs7T0FNRztJQUNILFlBQVksQ0FBQyxHQUFXO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDcEIsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsV0FBVyxDQUFDLEtBQWE7UUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQztZQUNsQyxPQUFPLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQztRQUNELE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzNCLEdBQUcsQ0FBQztZQUNGLGNBQWMsSUFBSSxTQUFTLENBQUM7WUFDNUIsQ0FBQyxFQUFFLENBQUM7UUFDTixDQUFDLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxTQUFTLENBQUMsS0FBc0I7UUFDOUIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO1lBQUUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQzs4R0FyRFUsZUFBZTs0R0FBZixlQUFlOzsyRkFBZixlQUFlO2tCQUozQixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxhQUFhO29CQUNuQixVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1BpcGUsIFBpcGVUcmFuc2Zvcm19IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdmb3JtYXRCeXRlcycsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1hdEJ5dGVzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAvLyBUaGlzIGhhcyBiZWVuIGNvcGllZCBhbmQgc2xpZ2h0bHkgbW9kaWZpZWQgZnJvbSBmaXJlYmFzZS10b29scy11aVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9maXJlYmFzZS9maXJlYmFzZS10b29scy11aS9ibG9iLzhhZDMxZDc0OGY2ODdiYmIwNGI4Mzg0MzBjNDYwMTIxZjlhOGUzMzgvc3JjL2NvbXBvbmVudHMvY29tbW9uL2Zvcm1hdEJ5dGVzLnRzXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgbnVtYmVyIGJ5IGFkZGluZyBjb21tYXMgYXMgdGhvdXNhbmRzIHNlcGFyYXRvcnMgYW5kXG4gICAqIGxpbWl0aW5nIHRvIHR3byBkZWNpbWFsIHBsYWNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IG51bSAtIFRoZSBudW1iZXIgdG8gZm9ybWF0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgbnVtYmVyIGFzIGEgc3RyaW5nLlxuICAgKi9cbiAgZm9ybWF0TnVtYmVyKG51bTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJ0cyA9IG51bS50b0ZpeGVkKDIpLnNwbGl0KCcuJyk7XG4gICAgcGFydHNbMF0gPSBwYXJ0c1swXS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICAgIGlmICgrcGFydHNbMV0gPT09IDApIHtcbiAgICAgIHJldHVybiBwYXJ0c1swXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oJy4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG51bWJlciBvZiBieXRlcyBpbnRvIGEgaHVtYW4tcmVhZGFibGUgZm9ybWF0IHdpdGggdW5pdHNcbiAgICogKGUuZy4sIGtCLCBNQiwgR0IpLlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYnl0ZXMgLSBUaGUgbnVtYmVyIG9mIGJ5dGVzLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgYnl0ZSBzaXplIHJlcHJlc2VudGF0aW9uLlxuICAgKi9cbiAgZm9ybWF0Qnl0ZXMoYnl0ZXM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgdGhyZXNob2xkID0gMTAyNDtcbiAgICBpZiAoTWF0aC5yb3VuZChieXRlcykgPCB0aHJlc2hvbGQpIHtcbiAgICAgIHJldHVybiBieXRlcyArICcgQic7XG4gICAgfVxuICAgIGNvbnN0IHVuaXRzID0gWydrQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddO1xuICAgIGxldCB1ID0gLTE7XG4gICAgbGV0IGZvcm1hdHRlZEJ5dGVzID0gYnl0ZXM7XG4gICAgZG8ge1xuICAgICAgZm9ybWF0dGVkQnl0ZXMgLz0gdGhyZXNob2xkO1xuICAgICAgdSsrO1xuICAgIH0gd2hpbGUgKE1hdGguYWJzKGZvcm1hdHRlZEJ5dGVzKSA+PSB0aHJlc2hvbGQgJiYgdSA8IHVuaXRzLmxlbmd0aCAtIDEpO1xuICAgIHJldHVybiB0aGlzLmZvcm1hdE51bWJlcihmb3JtYXR0ZWRCeXRlcykgKyAnICcgKyB1bml0c1t1XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGEgdmFsdWUgcmVwcmVzZW50aW5nIGJ5dGVzIGludG8gYSBodW1hbi1yZWFkYWJsZSBmb3JtYXR0ZWRcbiAgICogc3RyaW5nLiBBY2NlcHRzIGJvdGggbnVtYmVycyBhbmQgc3RyaW5ncyBhcyBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBudW1iZXJ9IGJ5dGVzIC0gVGhlIGJ5dGUgdmFsdWUgdG8gdHJhbnNmb3JtLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgYnl0ZSBzaXplLlxuICAgKi9cbiAgdHJhbnNmb3JtKGJ5dGVzOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSBieXRlcyA9IE51bWJlcihieXRlcyk7XG5cbiAgICByZXR1cm4gdGhpcy5mb3JtYXRCeXRlcyhieXRlcyk7XG4gIH1cbn1cbiJdfQ==