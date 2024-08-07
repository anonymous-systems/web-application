import { Injectable, isDevMode } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/snack-bar";
export class ConsoleLoggerService {
    constructor(snackBar) {
        this.snackBar = snackBar;
        /**
         * Checks if the application is currently running in development mode.
         *
         * @return {boolean} True if in development mode, false otherwise.
         */
        this.isInDevelopmentMode = () => isDevMode();
    }
    /**
     * Logs a debug message to the console if in development mode.
     *
     * @param {string} value - The primary message to log.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    debug(value, ...restOfError) {
        if (!this.isInDevelopmentMode())
            return;
        console.debug(`${value}: `, restOfError);
    }
    /**
     * Logs an informational message to the console and displays a snackbar
     * notification if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    info(value, ...restOfError) {
        if (this.isInDevelopmentMode()) {
            console.info(`${value}: `, restOfError);
        }
        this.openSnackBar(value, 'OK', { duration: 5000, panelClass: 'info' });
    }
    /**
     * Logs a general message to the console and displays a snackbar notification
     * if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    log(value, ...restOfError) {
        if (this.isInDevelopmentMode()) {
            console.log(`${value}: `, restOfError);
        }
        this.openSnackBar(value, 'OK', { duration: 5000, panelClass: 'log' });
    }
    /**
     * Logs a warning message to the console and displays a snackbar notification
     * if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    warn(value, ...restOfError) {
        if (this.isInDevelopmentMode()) {
            console.warn(`${value}: `, restOfError);
        }
        this.openSnackBar(value, 'OK', { duration: 10000, panelClass: 'warn' });
    }
    /**
     * Logs an error message to the console and displays a snackbar notification
     * if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    error(value, ...restOfError) {
        if (this.isInDevelopmentMode()) {
            console.error(`${value}: `, restOfError);
        }
        this.openSnackBar(value, 'OK', { duration: 0, panelClass: 'error' });
    }
    /**
     * Opens a Material Design snackbar notification.
     *
     * @param {string} message - The text message to display.
     * @param {string | undefined} action - Optional label for the snackbar
     * action button.
     * @param {MatSnackBarConfig | undefined} config - Configuration options for
     * the snackbar.
     * @return {MatSnackBarRef<TextOnlySnackBar>} A reference to the snackbar.
     */
    openSnackBar(message, action, config) {
        return this.snackBar.open(message, action, config);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: ConsoleLoggerService, deps: [{ token: i1.MatSnackBar }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: ConsoleLoggerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: ConsoleLoggerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.MatSnackBar }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS1sb2dnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZmlyZWJhc2Utc3RvcmFnZS1tYW5hZ2VyL3NyYy9saWIvc2VydmljZXMvY29uc29sZS1sb2dnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBTXBELE1BQU0sT0FBTyxvQkFBb0I7SUFRL0IsWUFBb0IsUUFBcUI7UUFBckIsYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQVB6Qzs7OztXQUlHO1FBQ0gsd0JBQW1CLEdBQUcsR0FBWSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFTCxDQUFDO0lBRTdDOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxLQUFhLEVBQUUsR0FBRyxXQUFzQjtRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQUUsT0FBTztRQUN4QyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFJLENBQUMsS0FBYSxFQUFFLEdBQUcsV0FBc0I7UUFDM0MsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxXQUFzQjtRQUMxQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsSUFBSSxDQUFDLEtBQWEsRUFBRSxHQUFHLFdBQXNCO1FBQzNDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQztZQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsS0FBYSxFQUFFLEdBQUcsV0FBc0I7UUFDNUMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsWUFBWSxDQUNSLE9BQWUsRUFDZixNQUEwQixFQUMxQixNQUFxQztRQUV2QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckQsQ0FBQzs4R0FsR1Usb0JBQW9CO2tIQUFwQixvQkFBb0IsY0FEUixNQUFNOzsyRkFDbEIsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgaXNEZXZNb2RlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1hdFNuYWNrQmFyLCBNYXRTbmFja0JhckNvbmZpZywgTWF0U25hY2tCYXJSZWYsIFRleHRPbmx5U25hY2tCYXIsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIENvbnNvbGVMb2dnZXJTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgYXBwbGljYXRpb24gaXMgY3VycmVudGx5IHJ1bm5pbmcgaW4gZGV2ZWxvcG1lbnQgbW9kZS5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBpbiBkZXZlbG9wbWVudCBtb2RlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBpc0luRGV2ZWxvcG1lbnRNb2RlID0gKCk6IGJvb2xlYW4gPT4gaXNEZXZNb2RlKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzbmFja0JhcjogTWF0U25hY2tCYXIpIHt9XG5cbiAgLyoqXG4gICAqIExvZ3MgYSBkZWJ1ZyBtZXNzYWdlIHRvIHRoZSBjb25zb2xlIGlmIGluIGRldmVsb3BtZW50IG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIFRoZSBwcmltYXJ5IG1lc3NhZ2UgdG8gbG9nLlxuICAgKiBAcGFyYW0gey4uLnVua25vd25bXX0gcmVzdE9mRXJyb3IgLSBBZGRpdGlvbmFsIHZhbHVlcyBvciBlcnJvciBvYmplY3RzXG4gICAqIHRvIGxvZy5cbiAgICovXG4gIGRlYnVnKHZhbHVlOiBzdHJpbmcsIC4uLnJlc3RPZkVycm9yOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNJbkRldmVsb3BtZW50TW9kZSgpKSByZXR1cm47XG4gICAgY29uc29sZS5kZWJ1ZyhgJHt2YWx1ZX06IGAsIHJlc3RPZkVycm9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGFuIGluZm9ybWF0aW9uYWwgbWVzc2FnZSB0byB0aGUgY29uc29sZSBhbmQgZGlzcGxheXMgYSBzbmFja2JhclxuICAgKiBub3RpZmljYXRpb24gaWYgaW4gZGV2ZWxvcG1lbnQgbW9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVGhlIHByaW1hcnkgbWVzc2FnZSB0byBsb2cgYW5kIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7Li4udW5rbm93bltdfSByZXN0T2ZFcnJvciAtIEFkZGl0aW9uYWwgdmFsdWVzIG9yIGVycm9yIG9iamVjdHNcbiAgICogdG8gbG9nLlxuICAgKi9cbiAgaW5mbyh2YWx1ZTogc3RyaW5nLCAuLi5yZXN0T2ZFcnJvcjogdW5rbm93bltdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJbkRldmVsb3BtZW50TW9kZSgpKSB7XG4gICAgICBjb25zb2xlLmluZm8oYCR7dmFsdWV9OiBgLCByZXN0T2ZFcnJvcik7XG4gICAgfVxuICAgIHRoaXMub3BlblNuYWNrQmFyKHZhbHVlLCAnT0snLCB7ZHVyYXRpb246IDUwMDAsIHBhbmVsQ2xhc3M6ICdpbmZvJ30pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYSBnZW5lcmFsIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUgYW5kIGRpc3BsYXlzIGEgc25hY2tiYXIgbm90aWZpY2F0aW9uXG4gICAqIGlmIGluIGRldmVsb3BtZW50IG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIFRoZSBwcmltYXJ5IG1lc3NhZ2UgdG8gbG9nIGFuZCBkaXNwbGF5LlxuICAgKiBAcGFyYW0gey4uLnVua25vd25bXX0gcmVzdE9mRXJyb3IgLSBBZGRpdGlvbmFsIHZhbHVlcyBvciBlcnJvciBvYmplY3RzXG4gICAqIHRvIGxvZy5cbiAgICovXG4gIGxvZyh2YWx1ZTogc3RyaW5nLCAuLi5yZXN0T2ZFcnJvcjogdW5rbm93bltdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJbkRldmVsb3BtZW50TW9kZSgpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgJHt2YWx1ZX06IGAsIHJlc3RPZkVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5vcGVuU25hY2tCYXIodmFsdWUsICdPSycsIHtkdXJhdGlvbjogNTAwMCwgcGFuZWxDbGFzczogJ2xvZyd9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGEgd2FybmluZyBtZXNzYWdlIHRvIHRoZSBjb25zb2xlIGFuZCBkaXNwbGF5cyBhIHNuYWNrYmFyIG5vdGlmaWNhdGlvblxuICAgKiBpZiBpbiBkZXZlbG9wbWVudCBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBUaGUgcHJpbWFyeSBtZXNzYWdlIHRvIGxvZyBhbmQgZGlzcGxheS5cbiAgICogQHBhcmFtIHsuLi51bmtub3duW119IHJlc3RPZkVycm9yIC0gQWRkaXRpb25hbCB2YWx1ZXMgb3IgZXJyb3Igb2JqZWN0c1xuICAgKiB0byBsb2cuXG4gICAqL1xuICB3YXJuKHZhbHVlOiBzdHJpbmcsIC4uLnJlc3RPZkVycm9yOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0luRGV2ZWxvcG1lbnRNb2RlKCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgJHt2YWx1ZX06IGAsIHJlc3RPZkVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5vcGVuU25hY2tCYXIodmFsdWUsICdPSycsIHtkdXJhdGlvbjogMTAwMDAsIHBhbmVsQ2xhc3M6ICd3YXJuJ30pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgY29uc29sZSBhbmQgZGlzcGxheXMgYSBzbmFja2JhciBub3RpZmljYXRpb25cbiAgICogaWYgaW4gZGV2ZWxvcG1lbnQgbW9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVGhlIHByaW1hcnkgbWVzc2FnZSB0byBsb2cgYW5kIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7Li4udW5rbm93bltdfSByZXN0T2ZFcnJvciAtIEFkZGl0aW9uYWwgdmFsdWVzIG9yIGVycm9yIG9iamVjdHNcbiAgICogdG8gbG9nLlxuICAgKi9cbiAgZXJyb3IodmFsdWU6IHN0cmluZywgLi4ucmVzdE9mRXJyb3I6IHVua25vd25bXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzSW5EZXZlbG9wbWVudE1vZGUoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgJHt2YWx1ZX06IGAsIHJlc3RPZkVycm9yKTtcbiAgICB9XG4gICAgdGhpcy5vcGVuU25hY2tCYXIodmFsdWUsICdPSycsIHtkdXJhdGlvbjogMCwgcGFuZWxDbGFzczogJ2Vycm9yJ30pO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGEgTWF0ZXJpYWwgRGVzaWduIHNuYWNrYmFyIG5vdGlmaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBUaGUgdGV4dCBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBhY3Rpb24gLSBPcHRpb25hbCBsYWJlbCBmb3IgdGhlIHNuYWNrYmFyXG4gICAqIGFjdGlvbiBidXR0b24uXG4gICAqIEBwYXJhbSB7TWF0U25hY2tCYXJDb25maWcgfCB1bmRlZmluZWR9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3JcbiAgICogdGhlIHNuYWNrYmFyLlxuICAgKiBAcmV0dXJuIHtNYXRTbmFja0JhclJlZjxUZXh0T25seVNuYWNrQmFyPn0gQSByZWZlcmVuY2UgdG8gdGhlIHNuYWNrYmFyLlxuICAgKi9cbiAgb3BlblNuYWNrQmFyKFxuICAgICAgbWVzc2FnZTogc3RyaW5nLFxuICAgICAgYWN0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgICBjb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnIHwgdW5kZWZpbmVkLFxuICApOiBNYXRTbmFja0JhclJlZjxUZXh0T25seVNuYWNrQmFyPiB7XG4gICAgcmV0dXJuIHRoaXMuc25hY2tCYXIub3BlbihtZXNzYWdlLCBhY3Rpb24sIGNvbmZpZyk7XG4gIH1cbn1cbiJdfQ==