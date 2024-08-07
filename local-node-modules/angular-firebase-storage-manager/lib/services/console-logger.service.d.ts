import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import * as i0 from "@angular/core";
export declare class ConsoleLoggerService {
    private snackBar;
    /**
     * Checks if the application is currently running in development mode.
     *
     * @return {boolean} True if in development mode, false otherwise.
     */
    isInDevelopmentMode: () => boolean;
    constructor(snackBar: MatSnackBar);
    /**
     * Logs a debug message to the console if in development mode.
     *
     * @param {string} value - The primary message to log.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    debug(value: string, ...restOfError: unknown[]): void;
    /**
     * Logs an informational message to the console and displays a snackbar
     * notification if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    info(value: string, ...restOfError: unknown[]): void;
    /**
     * Logs a general message to the console and displays a snackbar notification
     * if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    log(value: string, ...restOfError: unknown[]): void;
    /**
     * Logs a warning message to the console and displays a snackbar notification
     * if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    warn(value: string, ...restOfError: unknown[]): void;
    /**
     * Logs an error message to the console and displays a snackbar notification
     * if in development mode.
     *
     * @param {string} value - The primary message to log and display.
     * @param {...unknown[]} restOfError - Additional values or error objects
     * to log.
     */
    error(value: string, ...restOfError: unknown[]): void;
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
    openSnackBar(message: string, action: string | undefined, config: MatSnackBarConfig | undefined): MatSnackBarRef<TextOnlySnackBar>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConsoleLoggerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConsoleLoggerService>;
}
