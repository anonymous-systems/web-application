import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Inject, Input, Pipe, isDevMode, Injectable, EventEmitter, Output, Directive, HostListener, input, output, effect } from '@angular/core';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import * as i2 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i3 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import * as i4 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as i5 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT, DatePipe, NgOptimizedImage, AsyncPipe, NgClass } from '@angular/common';
import * as i1$1 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i6 from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import * as i7 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as i4$1 from '@angular/material/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as i1$4 from '@angular/cdk/clipboard';
import * as i1$2 from '@angular/material/snack-bar';
import * as i1$3 from '@angular/fire/storage';
import { ref, listAll, uploadBytes, getMetadata, getDownloadURL, deleteObject } from '@angular/fire/storage';
import * as i1$5 from '@angular/platform-browser';
import { first } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

class NewFolderDialogComponent {
    /**
     * Constructor for the dialog component.
     *
     * @param {NewFolderDialogContract} data - Injected data containing initial
     * folder information.
     * @param {MatDialogRef} dialogRef - A reference to this dialog instance,
     * used for controlling its behavior.
     */
    constructor(data, dialogRef) {
        this.data = data;
        this.dialogRef = dialogRef;
    }
    /**
     * Closes the dialog and passes back the entered folder name.
     */
    createFolder() {
        const newFolderCloseContract = {
            folderName: this.data.folderName,
        };
        this.dialogRef.close(newFolderCloseContract);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: NewFolderDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i1.MatDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.3", type: NewFolderDialogComponent, isStandalone: true, selector: "anon-new-folder-dialog", ngImport: i0, template: "<h1 mat-dialog-title>Create folder</h1>\n\n<mat-dialog-content>\n  <form class=\"new-folder\" (ngSubmit)=\"createFolder()\">\n    <mat-form-field appearance=\"outline\">\n      <mat-label>New folder name</mat-label>\n      <input matInput name=\"folderName\" [(ngModel)]=\"data.folderName\">\n    </mat-form-field>\n  </form>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button mat-button type=\"button\" mat-dialog-close>Cancel</button>\n  <button mat-raised-button\n          color=\"primary\"\n          type=\"submit\"\n          [disabled]=\"!data.folderName\"\n          (click)=\"createFolder()\">Create</button>\n</mat-dialog-actions>\n", styles: ["::ng-deep .mat-dialog-container{border-radius:1rem}mat-dialog-content form.new-folder{margin-top:1rem}\n"], dependencies: [{ kind: "ngmodule", type: MatDialogModule }, { kind: "directive", type: i1.MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }, { kind: "directive", type: i1.MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: i1.MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "directive", type: i1.MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i2.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i2.MatLabel, selector: "mat-label" }, { kind: "ngmodule", type: MatInputModule }, { kind: "directive", type: i3.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i4.NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: NewFolderDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-new-folder-dialog', standalone: true, imports: [
                        MatDialogModule,
                        MatFormFieldModule,
                        MatInputModule,
                        FormsModule,
                        MatButtonModule,
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<h1 mat-dialog-title>Create folder</h1>\n\n<mat-dialog-content>\n  <form class=\"new-folder\" (ngSubmit)=\"createFolder()\">\n    <mat-form-field appearance=\"outline\">\n      <mat-label>New folder name</mat-label>\n      <input matInput name=\"folderName\" [(ngModel)]=\"data.folderName\">\n    </mat-form-field>\n  </form>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button mat-button type=\"button\" mat-dialog-close>Cancel</button>\n  <button mat-raised-button\n          color=\"primary\"\n          type=\"submit\"\n          [disabled]=\"!data.folderName\"\n          (click)=\"createFolder()\">Create</button>\n</mat-dialog-actions>\n", styles: ["::ng-deep .mat-dialog-container{border-radius:1rem}mat-dialog-content form.new-folder{margin-top:1rem}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i1.MatDialogRef }] });

class DeleteFilesDialogComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: DeleteFilesDialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.3", type: DeleteFilesDialogComponent, isStandalone: true, selector: "anon-delete-files-dialog", ngImport: i0, template: "<h1 mat-dialog-title>\n  <span>Delete files</span>\n</h1>\n\n<mat-dialog-content>\n  You may be deleting user data. After you delete this, it can not be recovered.\n</mat-dialog-content>\n\n<div mat-dialog-actions align=\"end\">\n  <button mat-button type=\"button\" mat-dialog-close>Cancel</button>\n  \n  <button mat-raised-button color=\"warn\" type=\"button\"\n          [mat-dialog-close]=\"true\">Delete</button>\n</div>\n", styles: ["::ng-deep .mat-dialog-container{border-radius:1rem}\n"], dependencies: [{ kind: "ngmodule", type: MatDialogModule }, { kind: "directive", type: i1.MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }, { kind: "directive", type: i1.MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: i1.MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "directive", type: i1.MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: DeleteFilesDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-delete-files-dialog', standalone: true, imports: [MatDialogModule, MatButtonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "<h1 mat-dialog-title>\n  <span>Delete files</span>\n</h1>\n\n<mat-dialog-content>\n  You may be deleting user data. After you delete this, it can not be recovered.\n</mat-dialog-content>\n\n<div mat-dialog-actions align=\"end\">\n  <button mat-button type=\"button\" mat-dialog-close>Cancel</button>\n  \n  <button mat-raised-button color=\"warn\" type=\"button\"\n          [mat-dialog-close]=\"true\">Delete</button>\n</div>\n", styles: ["::ng-deep .mat-dialog-container{border-radius:1rem}\n"] }]
        }] });

class StorageItemIconComponent {
    constructor() {
        /**
         * The type of item to represent.
         * Can be either 'file' or 'folder'. Defaults to 'folder'.
         */
        this.type = 'folder';
        // This is copied as is from firebase-tools-ui
        // https://github.com/firebase/firebase-tools-ui/blob/8ad31d748f687bbb04b838430c460121f9a8e338/src/components/Storage/common/StorageFileIcon/StorageFileIcon.tsx
        /**
         * A mapping of MIME content types to Material Design icon names.
         * Used for determining specific icons for different file types.
         * @private
         */
        this.MIME_TYPE_ICON_MAP = {
            // pdf
            'application/pdf': 'picture_as_pdf',
            // images
            'image/gif': 'image',
            'image/jpg': 'image',
            'image/jpeg': 'image',
            'image/png': 'image',
            'image/svg+xml': 'image',
            'image/webp': 'image',
            // audio
            'audio/m4a': 'audio_file',
            'audio/mp3': 'audio_file',
            'audio/mpeg': 'audio_file',
            'audio/wav': 'audio_file',
            'audio/x-ms-wma': 'audio_file',
            // video
            'video/avi': 'video_file',
            'video/mp4': 'video_file',
            'video/mpeg': 'video_file',
            'video/quicktime': 'video_file',
            'video/x-ms-wmv': 'video_file',
            'video/x-matroska': 'video_file',
            'video/webp': 'video_file',
            // zip
            'application/zip': 'folder_zip',
            // text documents
            'text/javascript': 'javascript',
            'text/plain': 'text_snippet',
        };
        /**
         * A default Material Design icon name used when a specific
         * content type match is not found.
         * @private
         */
        this.DEFAULT_MIME_TYPE_ICON = 'file_present';
    }
    /**
     * Determines the appropriate Material Design icon name based on
     * the provided content type or a default.
     *
     * @param {string} contentType - The MIME content type of the file (optional).
     * @return {string} The name of the Material Design icon to use.
     */
    getFileIcon(contentType) {
        if (!contentType)
            return this.DEFAULT_MIME_TYPE_ICON;
        return this.MIME_TYPE_ICON_MAP[contentType] || this.DEFAULT_MIME_TYPE_ICON;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: StorageItemIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.3", type: StorageItemIconComponent, isStandalone: true, selector: "anon-storage-item-icon", inputs: { type: "type", contentType: "contentType" }, ngImport: i0, template: "@if (type === 'folder') {\n  <mat-icon class=\"material-icons-round\" fontIcon=\"folder\" />\n} @else {\n   \n  <mat-icon class=\"material-icons-round\" [fontIcon]=\"getFileIcon(contentType)\" />\n}\n", styles: ["mat-icon{color:#0000008a;margin-right:.25rem}\n"], dependencies: [{ kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i1$1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: StorageItemIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-storage-item-icon', standalone: true, imports: [MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (type === 'folder') {\n  <mat-icon class=\"material-icons-round\" fontIcon=\"folder\" />\n} @else {\n   \n  <mat-icon class=\"material-icons-round\" [fontIcon]=\"getFileIcon(contentType)\" />\n}\n", styles: ["mat-icon{color:#0000008a;margin-right:.25rem}\n"] }]
        }], propDecorators: { type: [{
                type: Input
            }], contentType: [{
                type: Input
            }] } });

class FormatBytesPipe {
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

class ConsoleLoggerService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: ConsoleLoggerService, deps: [{ token: i1$2.MatSnackBar }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: ConsoleLoggerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: ConsoleLoggerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1$2.MatSnackBar }] });

class FirebaseStorageService {
    constructor(storage, document) {
        this.storage = storage;
        this.document = document;
    }
    /**
     * Retrieves a StorageReference object for interacting with
     * Firebase Storage at the given path.
     *
     * @param {string} path - The desired path within Firebase Storage.
     * @return {StorageReference} A reference to the specified location.
     */
    getRef(path) {
        return ref(this.storage, path);
    }
    /**
     * Lists all files and prefixes (subfolders) within a Firebase Storage
     * directory.
     *
     * @param {StorageReference} listRef - A reference to the directory to list.
     * @return {Promise<ListResult>} Resolves with the listing results.
     */
    async listAll(listRef) {
        return await listAll(listRef);
    }
    /**
     * Uploads a file to Firebase Storage with metadata for correct download
     * behavior.
     *
     * @param {StorageReference} ref - Reference to the target upload location.
     * @param {File} file - The file object to upload.
     * @return {Promise<UploadResult>} Resolves with the upload results.
     */
    async uploadFile(ref, file) {
        /*
        * set content disposition to show filename instead of path on downloads
        * file name cannot contain a ","(comma), it will be included in the
        * content disposition */
        const metadata = {
            contentDisposition: `attachment; filename=${file.name}`,
        };
        return await uploadBytes(ref, file, metadata);
    }
    /**
     * Uploads multiple files in parallel, optionally placing them within a
     * folder.
     *
     * @param {File[]} files - An array of file objects to upload.
     * @param {string} [folder] - Optional folder name for the uploaded files.
     * @return {Promise<UploadResult[]>} Resolves with an array of upload results.
     */
    async uploadFiles(files, folder) {
        return Promise.all(files.map(async (file) => {
            const path = folder ? `${folder}/${file.name}` : file.name;
            const fileRef = this.getRef(path);
            return await this.uploadFile(fileRef, file);
        }));
    }
    /**
     * Fetches full metadata for a file in Firebase Storage and
     * constructs a StorageFile object.
     *
     * @param {StorageReference} fileRef - A reference to the file.
     * @return {Promise<StorageFile>} Resolves with the StorageFile
     * representation.
     */
    async importFile(fileRef) {
        const metadata = await getMetadata(fileRef);
        return { type: 'file', ...metadata };
    }
    /**
     * Creates a StorageFolder object representing a Firebase Storage folder.
     *
     * @param {StorageReference} folder - A reference to the folder.
     * @return {StorageFolder}
     */
    importFolder(folder) {
        return {
            type: 'folder',
            name: folder.name,
            fullPath: folder.fullPath,
        };
    }
    /**
     * Retrieves a direct download URL for a file in Firebase Storage.
     *
     * @param {StorageReference} ref - A reference to the file.
     * @return {Promise<string>} Resolves with the download URL string.
     */
    async getDownloadURL(ref) {
        return getDownloadURL(ref);
    }
    /**
     * Opens all provided files in new browser tabs by generating download URLs
     * and triggering download links.
     *
     * @param {StorageItem[]} files - An array of StorageItem objects
     * representing files.
     */
    async openAllFiles(files) {
        const paths = files.map((file) => file.fullPath);
        const links = await Promise.all(paths.map((path) => this.getRef(path))
            .map((ref) => this.getDownloadURL(ref)));
        links.forEach((url) => {
            const anchor = this.createAnchorElement(url);
            anchor.click();
        });
    }
    /**
     * Recursively deletes a folder and its contents from Firebase Storage.
     * Handles potential errors if the physical folder doesn't exist.
     *
     * @param {string} path - The full path of the folder to delete.
     */
    async deleteFolder(path) {
        const { items, prefixes } = await this.listAll(this.getRef(path));
        try {
            /**
             * We don't know if physical folder exists, or it is inferred from
             * nested file path.
             *
             * So here we attempt to delete physical representation, but if it does
             * not exist, we just swallow the error.
             */
            await this.deleteFile(path + `%2f`);
        }
        catch {
            // quietly swallow any errors.
        }
        const prefixesPromise = prefixes.map(async (prefix) => {
            return await this.deleteFolder(prefix.fullPath);
        });
        const filesPromise = items.map(async (file) => {
            return await this.deleteFile(file.fullPath);
        });
        await Promise.all([...filesPromise, ...prefixesPromise]);
    }
    /**
     * Deletes a file from Firebase Storage.
     *
     * @param {string} path - The full path to the file.
     */
    async deleteFile(path) {
        return deleteObject(this.getRef(path));
    }
    /**
     * Deletes multiple files or folders from Firebase Storage.
     *
     * @param {StorageItem[]} items - An array of StorageItem objects.
     */
    async deleteFiles(items) {
        return await Promise.all(items.map(async (item) => {
            if (item?.type === 'folder') {
                return await this.deleteFolder(item.fullPath);
            }
            else if (item?.type === 'file') {
                return await this.deleteFile(item.fullPath);
            }
        }));
    }
    /**
     * Helper function to create a download link element.
     *
     * @param {string} url - The download URL for the file.
     * @return {HTMLAnchorElement} A configured anchor element for triggering
     * a download.
     */
    createAnchorElement(url) {
        const a = this.document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        return a;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FirebaseStorageService, deps: [{ token: i1$3.Storage }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FirebaseStorageService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FirebaseStorageService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1$3.Storage }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

class StorageFilePreviewComponent {
    constructor(clipboard, cLog, storageService) {
        this.clipboard = clipboard;
        this.cLog = cLog;
        this.storageService = storageService;
        /**
         * Emits an event when the preview should be closed.
         * @event
         */
        this._close = new EventEmitter();
        /**
         * Indicates whether an error occurred while generating the file preview URL.
         */
        this.previewError = false;
    }
    ngOnChanges() {
        if (!this.item)
            return;
        /**
         * Fetches the download URL for the new file and updates the preview state.
         */
        const fileRef = this.storageService.getRef(this.item.fullPath);
        this.storageService.getDownloadURL(fileRef)
            .then((downloadURL) => {
            this.previewError = false;
            this.downloadURL = downloadURL;
        }).catch((error) => {
            this.cLog.error(`Error getting download URL for '${this.item?.name}'`, error, this.item);
        });
    }
    /**
     * Emits the '_close' event to signal that the preview should be closed.
     */
    closePreview() {
        this._close.emit(undefined);
    }
    onCopy() {
        if (this.downloadURL) {
            const success = this.clipboard.copy(this.downloadURL);
            if (success)
                this.cLog.info('Copied to clipboard');
            else
                this.cLog.info('Error copying to clipboard');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: StorageFilePreviewComponent, deps: [{ token: i1$4.Clipboard }, { token: ConsoleLoggerService }, { token: FirebaseStorageService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.3", type: StorageFilePreviewComponent, isStandalone: true, selector: "anon-storage-file-preview", inputs: { item: "item" }, outputs: { _close: "_close" }, usesOnChanges: true, ngImport: i0, template: "@if (item) {\n  <div class=\"header\">\n    <div class=\"name\">\n      <anon-storage-item-icon [type]=\"item.type!\" [contentType]=\"item.contentType!\" />\n      <span matTooltipShowDelay=\"500\" [matTooltip]=\"item.name\">{{item.name}}</span>\n    </div>\n\n    <button mat-icon-button type=\"button\" (click)=\"closePreview()\">\n      <mat-icon fontIcon=\"close\" />\n    </button>\n  </div>\n\n  @if (downloadURL) {\n     \n    @if (item.contentType?.startsWith('image/')) {\n      <picture class=\"file-preview\">\n        <img fill [ngSrc]=\"downloadURL\" [alt]=\"item.fullPath\"\n             (error)=\"downloadURL=undefined;previewError=true\" />\n      </picture>\n       \n    } @else if (item.contentType?.startsWith('video/')) {\n      <video class=\"file-preview\" controls autoplay loop>\n        <source [type]=\"item.contentType\" [src]=\"downloadURL\"\n                (error)=\"downloadURL=undefined;previewError=true\"/>\n      </video>\n    }\n\n    <div class=\"btn-container\">\n      <div class=\"download-btn\">\n        <a mat-stroked-button type=\"button\" color=\"primary\" target=\"_blank\" [href]=\"downloadURL\">\n          <mat-icon fontIcon=\"download\" />\n          <span>Download</span>\n        </a>\n      </div>\n\n      <div class=\"copy-btn\">\n        <button mat-stroked-button type=\"button\" color=\"primary\" (click)=\"onCopy()\">\n          <mat-icon fontIcon=\"file_copy\" />\n          <span>Copy</span>\n        </button>\n      </div>\n    </div>\n  }\n  @if (previewError) {\n    <h3 class=\"file-preview\">Preview Not Available.</h3>\n  }\n\n  <dl class=\"metadata\">\n    <dt>Name</dt>\n    <dd><a class=\"download-link\" target=\"_blank\" [href]=\"downloadURL\">{{item.name}}</a></dd>\n\n    <dt>Size</dt>\n    <dd>{{item.size | formatBytes}}</dd>\n\n    <dt>Type</dt>\n    <dd>{{item.contentType}}</dd>\n\n    <dt>Created</dt>\n    <dd>{{item.timeCreated | date:'short'}}</dd>\n\n    <dt>Last modified</dt>\n    <dd>{{item.updated | date:'short'}}</dd>\n  </dl>\n}\n", styles: [":host{display:block;margin-left:-1.5rem;flex-shrink:0;border-left-width:1px;border-left-style:solid;height:100%}.header{display:flex;justify-content:space-between;align-items:center;padding:.5rem 1.5rem}.header .name{display:flex;align-items:center;overflow:hidden}.header .name span{display:inline-block;flex-grow:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-preview{display:grid;place-content:center;max-width:100%;max-height:250px;padding:.5rem 1.5rem;box-sizing:border-box}.file-preview img{position:relative!important}.metadata{padding:0 1.5rem .5rem}.download-link{overflow-wrap:break-word}.btn-container{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem}\n"], dependencies: [{ kind: "component", type: StorageItemIconComponent, selector: "anon-storage-item-icon", inputs: ["type", "contentType"] }, { kind: "ngmodule", type: MatTooltipModule }, { kind: "directive", type: i4$1.MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i5.MatAnchor, selector: "a[mat-button], a[mat-raised-button], a[mat-flat-button], a[mat-stroked-button]", exportAs: ["matButton", "matAnchor"] }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: i5.MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i1$1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: FormatBytesPipe, name: "formatBytes" }, { kind: "pipe", type: DatePipe, name: "date" }, { kind: "directive", type: NgOptimizedImage, selector: "img[ngSrc]", inputs: ["ngSrc", "ngSrcset", "sizes", "width", "height", "loading", "priority", "loaderParams", "disableOptimizedSrcset", "fill", "placeholder", "placeholderConfig", "src", "srcset"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: StorageFilePreviewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-storage-file-preview', standalone: true, imports: [
                        StorageItemIconComponent,
                        MatTooltipModule,
                        MatButtonModule,
                        MatIconModule,
                        FormatBytesPipe,
                        DatePipe,
                        NgOptimizedImage,
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (item) {\n  <div class=\"header\">\n    <div class=\"name\">\n      <anon-storage-item-icon [type]=\"item.type!\" [contentType]=\"item.contentType!\" />\n      <span matTooltipShowDelay=\"500\" [matTooltip]=\"item.name\">{{item.name}}</span>\n    </div>\n\n    <button mat-icon-button type=\"button\" (click)=\"closePreview()\">\n      <mat-icon fontIcon=\"close\" />\n    </button>\n  </div>\n\n  @if (downloadURL) {\n     \n    @if (item.contentType?.startsWith('image/')) {\n      <picture class=\"file-preview\">\n        <img fill [ngSrc]=\"downloadURL\" [alt]=\"item.fullPath\"\n             (error)=\"downloadURL=undefined;previewError=true\" />\n      </picture>\n       \n    } @else if (item.contentType?.startsWith('video/')) {\n      <video class=\"file-preview\" controls autoplay loop>\n        <source [type]=\"item.contentType\" [src]=\"downloadURL\"\n                (error)=\"downloadURL=undefined;previewError=true\"/>\n      </video>\n    }\n\n    <div class=\"btn-container\">\n      <div class=\"download-btn\">\n        <a mat-stroked-button type=\"button\" color=\"primary\" target=\"_blank\" [href]=\"downloadURL\">\n          <mat-icon fontIcon=\"download\" />\n          <span>Download</span>\n        </a>\n      </div>\n\n      <div class=\"copy-btn\">\n        <button mat-stroked-button type=\"button\" color=\"primary\" (click)=\"onCopy()\">\n          <mat-icon fontIcon=\"file_copy\" />\n          <span>Copy</span>\n        </button>\n      </div>\n    </div>\n  }\n  @if (previewError) {\n    <h3 class=\"file-preview\">Preview Not Available.</h3>\n  }\n\n  <dl class=\"metadata\">\n    <dt>Name</dt>\n    <dd><a class=\"download-link\" target=\"_blank\" [href]=\"downloadURL\">{{item.name}}</a></dd>\n\n    <dt>Size</dt>\n    <dd>{{item.size | formatBytes}}</dd>\n\n    <dt>Type</dt>\n    <dd>{{item.contentType}}</dd>\n\n    <dt>Created</dt>\n    <dd>{{item.timeCreated | date:'short'}}</dd>\n\n    <dt>Last modified</dt>\n    <dd>{{item.updated | date:'short'}}</dd>\n  </dl>\n}\n", styles: [":host{display:block;margin-left:-1.5rem;flex-shrink:0;border-left-width:1px;border-left-style:solid;height:100%}.header{display:flex;justify-content:space-between;align-items:center;padding:.5rem 1.5rem}.header .name{display:flex;align-items:center;overflow:hidden}.header .name span{display:inline-block;flex-grow:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-preview{display:grid;place-content:center;max-width:100%;max-height:250px;padding:.5rem 1.5rem;box-sizing:border-box}.file-preview img{position:relative!important}.metadata{padding:0 1.5rem .5rem}.download-link{overflow-wrap:break-word}.btn-container{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem}\n"] }]
        }], ctorParameters: () => [{ type: i1$4.Clipboard }, { type: ConsoleLoggerService }, { type: FirebaseStorageService }], propDecorators: { item: [{
                type: Input
            }], _close: [{
                type: Output
            }] } });

class FileDropzoneDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        /**
         * Emits a FileList when files are dropped onto the host element.
         *
         * @event
         */
        this.dropped = new EventEmitter();
        /**
         * Emits a boolean indicating whether the host element is currently being
         * hovered over during a drag operation.
         *
         * @event
         */
        this.hovered = new EventEmitter();
        /**
         * The CSS class to apply to the host element when it's being hovered over.
         * Defaults to 'hovered'.
         */
        this.hoverClass = 'hovered';
    }
    /**
     * Handles the 'drop' event, emitting the dropped files and preventing
     * default behavior.
     *
     * @param {$event} $event - The DragEvent containing the dropped files.
     */
    onDrop($event) {
        $event.preventDefault();
        this.dropped.emit($event.dataTransfer?.files);
        this.onDragLeave($event);
    }
    /**
     * Handles the 'dragover' event, adding a hover class and emitting a
     * 'hovered' event with a value of 'true'. Prevents default behavior.
     *
     * @param {$event} $event - The DragEvent.
     */
    onDragOver($event) {
        $event.preventDefault();
        this.elementRef.nativeElement.classList.add(this.hoverClass);
        this.hovered.emit(true);
    }
    /**
     * Handles the 'dragleave' event, removing the hover class and emitting
     * a 'hovered' event with a value of 'false'. Prevents default behavior.
     *
     * @param {$event} $event - The DragEvent.
     */
    onDragLeave($event) {
        $event.preventDefault();
        this.elementRef.nativeElement.classList.remove(this.hoverClass);
        this.hovered.emit(false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FileDropzoneDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.3", type: FileDropzoneDirective, isStandalone: true, selector: "[anonFileDropzone]", inputs: { hoverClass: "hoverClass" }, outputs: { dropped: "dropped", hovered: "hovered" }, host: { listeners: { "drop": "onDrop($event)", "dragover": "onDragOver($event)", "dragleave": "onDragLeave($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FileDropzoneDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[anonFileDropzone]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { dropped: [{
                type: Output
            }], hovered: [{
                type: Output
            }], hoverClass: [{
                type: Input
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }] } });

class LoadingComponent {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        /**
         * Configures the height of the loading SVG (in pixels). Defaults to 250px.
         */
        this.height = input(250);
        /**
         * A dynamic SVG string representing the loading animation.
         * This string is generated using the provided height.
         * @private
         */
        this.LOADING_SVG = (height) => `<?xml version="1.0" encoding="utf-8"?><svg width='${height}px' height='${height}px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><defs><filter id="uil-ring-shadow" x="-100%" y="-100%" width="300%" height="300%"><feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset><feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur><feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend></filter></defs><path d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z" fill="#337ab7" filter="url(#uil-ring-shadow)"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite" dur="1s"></animateTransform></path></svg>`;
    }
    ngOnInit() {
        /**
         * Generating a SafeHtml version of the loading SVG using the provided
         * height.
         */
        if (this.height()) {
            this.svg = this.sanitizer
                .bypassSecurityTrustHtml(this.LOADING_SVG(this.height()));
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: LoadingComponent, deps: [{ token: i1$5.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "18.1.3", type: LoadingComponent, isStandalone: true, selector: "anon-loading", inputs: { height: { classPropertyName: "height", publicName: "height", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"loading\">\n    <!-- eslint-disable-next-line @angular-eslint/template/no-inline-styles -->\n    <div [style.height]=\"height()+'px'\" [innerHTML]=\"svg\"></div>\n</div>\n", styles: [".loading{display:flex;align-items:center;justify-content:center}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: LoadingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-loading', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"loading\">\n    <!-- eslint-disable-next-line @angular-eslint/template/no-inline-styles -->\n    <div [style.height]=\"height()+'px'\" [innerHTML]=\"svg\"></div>\n</div>\n", styles: [".loading{display:flex;align-items:center;justify-content:center}\n"] }]
        }], ctorParameters: () => [{ type: i1$5.DomSanitizer }] });

class LoadingOrErrorComponent {
    constructor() {
        /**
         * An optional Error object to display. If provided, the component will render
         * an error display instead of a loading indicator.
         */
        this.error = input();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: LoadingOrErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.3", type: LoadingOrErrorComponent, isStandalone: true, selector: "anon-loading-or-error", inputs: { error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "@if (error(); as error) {\n  <div class=\"error\">\n    <h2>Error!</h2>\n    \n    <p>\n      @if (error.message) {\n        {{error.message}}\n      } @else {\n        Something weird happened. Keep calm and try again later.\n      }\n    </p>\n  </div>\n} @else {\n  <anon-loading [height]=\"250\" />\n}\n", styles: ["div.error{color:#b3261e;margin:2rem;padding:2rem;text-align:center;border:1px dashed currentColor;border-radius:2rem}div.error h2{font-size:2rem}div.error p{margin-top:.25rem;font-size:1rem;color:initial}\n"], dependencies: [{ kind: "component", type: LoadingComponent, selector: "anon-loading", inputs: ["height"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: LoadingOrErrorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-loading-or-error', standalone: true, imports: [LoadingComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (error(); as error) {\n  <div class=\"error\">\n    <h2>Error!</h2>\n    \n    <p>\n      @if (error.message) {\n        {{error.message}}\n      } @else {\n        Something weird happened. Keep calm and try again later.\n      }\n    </p>\n  </div>\n} @else {\n  <anon-loading [height]=\"250\" />\n}\n", styles: ["div.error{color:#b3261e;margin:2rem;padding:2rem;text-align:center;border:1px dashed currentColor;border-radius:2rem}div.error h2{font-size:2rem}div.error p{margin-top:.25rem;font-size:1rem;color:initial}\n"] }]
        }] });

class FileManagerComponent {
    constructor(dialog, cLog, storageService) {
        this.dialog = dialog;
        this.cLog = cLog;
        this.storageService = storageService;
        /**
         * The columns to display in the file management table.
         */
        this.tableColumns = ['checkbox', 'name', 'size', 'type', 'lastModified'];
        /**
         * The current path within the storage system.
         */
        this.currentPath = '';
        /**
         * Used for managing multiple item selection within the file manager.
         */
        this.selection = new SelectionModel(true, []);
        /**
         * The root path within the storage system where the file manager operates.
         */
        this.rootStoragePath = '';
        this.selectionChangeSignal = toSignal(this.selection.changed);
        this.selectionChange = output();
        effect(() => {
            const selectionChange = this.selectionChangeSignal();
            this.selectionChange.emit(selectionChange?.source.selected || null);
        });
    }
    ngOnInit() {
        /** Sets the initial path within the storage system */
        this.currentPath = this.rootStoragePath;
        /** Fetches the initial storage items */
        this.items$ = this.getAllStorageItems(this.currentPath);
    }
    /**
     * Downloads the provided files by triggering download links.
     * @param {StorageItem[]} files - The files to download.
     */
    async downloadFiles(files) {
        await this.storageService.openAllFiles(files);
    }
    /**
     * Toggles the selection of all items in the file listing.
     *
     * @param {boolean} checked - Whether to select or deselect all items.
     * @param {StorageItem[]} items - The list of file items.
     */
    toggleAllItems(checked, items) {
        if (!checked) {
            this.selection.clear();
            return;
        }
        this.selection.select(...items);
    }
    /**
     * Checks if all items in the file listing are currently selected.
     *
     * @param {StorageItem[]} items - The list of file items.
     * @return {boolean} True if all items are selected, false otherwise.
     */
    allItemsSelected(items) {
        return this.selection.selected.length === items.length &&
            this.selection.selected.length > 0;
    }
    /**
     * Checks if some, but not all, items in the file listing are selected.
     *
     * @param {StorageItem[]} items - The list of file items.
     * @return {boolean} True if the selection state is indeterminate, false
     * otherwise.
     */
    allItemsIndeterminate(items) {
        return this.selection.selected.length > 0 &&
            this.selection.selected.length < items.length;
    }
    /**
     * Event handler for when a storage item is selected. Updates the navigation
     * if a folder is selected, or sets the selected file if a file is selected.
     *
     * @param {StorageItem} item - The selected StorageItem.
     */
    storageItemSelected(item) {
        if (item.type === 'folder')
            this.setStoragePath(item.fullPath);
        else if (item.type === 'file')
            this.selectedFile = item;
    }
    /**
     * Checks if the current selection includes at least one folder.
     *
     * @return {boolean} True if a folder is part of the selection, false
     * otherwise.
     */
    get selectionIncludesFolder() {
        return this.selection.selected.some((item) => item.type === 'folder');
    }
    /**
     * Opens a dialog to confirm deletion, and handles deleting selected items
     * if confirmed. Clears the selection and updates the file listing.
     *
     * @param {StorageItem[]} items - The items to delete.
     */
    deleteItems(items) {
        const dialogRef = this.dialog.open(DeleteFilesDialogComponent, {
            id: 'delete-files-dialog',
            minWidth: '250px',
        });
        dialogRef.afterClosed().pipe(first()).forEach((confirm) => {
            if (confirm) {
                this.storageService.deleteFiles(items)
                    .then(() => {
                    this.selection.clear();
                    if (items.some((item) => item == this.selectedFile)) {
                        this.selectedFile = undefined;
                    }
                })
                    .then(() => this.reload(this.currentPath));
            }
        });
    }
    /**
     * Constructs a breadcrumb-style path string based on the current path
     * history. Used for navigation display.
     *
     * @param {string[]} pathArray - An array of path segments.
     * @param {number} index - The index up to which path segments should be
     * included.
     * @return {string} The constructed path string.
     */
    getCrumbPath(pathArray, index) {
        pathArray.length = index + 1;
        return pathArray.join('/');
    }
    /**
     * Updates the current path and fetches the new file listing.
     * Clears any existing selection.
     *
     * @param {string} path - The new storage path.
     */
    setStoragePath(path) {
        this.items$ = this.getAllStorageItems(path);
        this.currentPath = path;
        if (this.selection.hasValue())
            this.selection.clear();
    }
    /**
     * Retrieves and processes all items within a given storage path.
     *
     * @param {string} path - The storage path to list.
     * @return {Promise<StorageItem[]>} A Promise resolving to the items,
     * or undefined in case of error.
     */
    async getAllStorageItems(path) {
        const storageRef = this.storageService.getRef(path);
        return this.storageService.listAll(storageRef)
            .then(async ({ items, prefixes }) => {
            const allItems = [
                ...prefixes.map(this.storageService.importFolder),
                ...(await Promise.all(items.map(this.storageService.importFile))),
            ];
            return allItems;
        })
            .catch((error) => {
            this.error = error;
            return new Promise(() => undefined);
        });
    }
    /**
     * Reloads the file and folder listing within the current or specified path.
     *
     * @param {string | null} path - Optional. The path to reload. If null,
     * the current path is used.
     */
    reload(path = null) {
        let pathRef;
        if (path)
            pathRef = this.storageService.getRef(path);
        else
            pathRef = this.storageService.getRef(this.currentPath);
        this.items$ = this.storageService.listAll(pathRef)
            .then(async ({ items, prefixes }) => [
            ...prefixes.map(this.storageService.importFolder),
            ...(await Promise.all(items.map(this.storageService.importFile))),
        ]);
    }
    /**
     * Opens a dialog to create a new folder and updates folder listing
     * if successful.
     */
    createNewFolder() {
        const newFolderContract = {
            folderName: '',
            path: this.currentPath,
        };
        const dialogRef = this.dialog.open(NewFolderDialogComponent, {
            id: 'create-new-folder-dialog',
            width: '250px',
            data: newFolderContract,
        });
        dialogRef.afterClosed()
            .pipe(first())
            .forEach((contract) => {
            if (contract.folderName) {
                const path = this.currentPath ?
                    `${this.currentPath}/${contract.folderName}` : contract.folderName;
                this.setStoragePath(path);
            }
        });
    }
    /**
     * Handles file upload logic, including validation and updating the
     * file listing upon successful upload. Logs errors if encountered.
     *
     * @param {FileList} files - An optional FileList of files to upload.
     */
    async uploadItems(files) {
        if (!files)
            return;
        // prevent file names to have ","(comma)
        if (Array.from(files).some((file) => file.name.includes(','))) {
            this.cLog.warn(`File names cannot include a ","(comma)`);
            return;
        }
        const uploadedFiles = [];
        for (const file of Array.from(files)) {
            const fileRef = this.storageService
                .getRef(`${this.currentPath}/${file.name}`);
            await this.storageService.uploadFile(fileRef, file)
                .then((snapshot) => uploadedFiles.push(snapshot))
                .catch((error) => {
                return this.handleUploadError(error, file.name);
            });
        }
        if (!uploadedFiles.length)
            return;
        this.reload(this.currentPath);
        /* eslint-disable-next-line max-len */
        this.cLog.info(`Uploaded ${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'file' : 'files'}`, uploadedFiles);
    }
    /**
     * Event handler for file input change. Triggers the upload process.
     *
     * @param {Event} $event - The file input change event.
     */
    async onFilesSelect($event) {
        const files = $event.target.files;
        await this.uploadItems(files);
    }
    /**
     * Handles logging of errors during the file upload process.
     *
     * @param {FirebaseError} error - The Firebase error object.
     * @param {string} filename - The name of the file that failed to upload.
     */
    handleUploadError(error, filename) {
        this.cLog.error(error.code === 'storage/unauthorized' ?
            'You do not have permission to upload' :
            `Error uploading file: '${filename}'`, error);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FileManagerComponent, deps: [{ token: i1.MatDialog }, { token: ConsoleLoggerService }, { token: FirebaseStorageService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.3", type: FileManagerComponent, isStandalone: true, selector: "anon-file-manager", inputs: { selection: "selection", selectedFile: "selectedFile", rootStoragePath: "rootStoragePath" }, outputs: { selectionChange: "selectionChange" }, ngImport: i0, template: "@if (items$ | async; as items) {\n  <div class=\"card\">\n    <input #inputUpload multiple class=\"inputUpload\"\n           type=\"file\" autocomplete=\"off\" tabindex=\"-1\"\n           (change)=\"onFilesSelect($event)\" />\n     \n    @if (selection.isEmpty()) {\n      <header class=\"header\">\n        <!-- Crumbs -->\n        <span class=\"crumbs\">\n          <button mat-icon-button type=\"button\"\n                  [disabled]=\"currentPath===rootStoragePath\"\n                  (click)=\"setStoragePath(rootStoragePath)\">\n            <mat-icon fontIcon=\"home\" />\n          </button>\n           \n          @for (crumb of currentPath.split('/'); track crumb;let i=$index; let last=$last) {\n            @if (crumb !== rootStoragePath) {\n              @if (currentPath!==rootStoragePath) {\n                <mat-icon class=\"overflow-visible\" fontIcon=\"chevron_right\" />\n              }\n              <button mat-button type=\"button\" [disabled]=\"last\"\n                      (click)=\"setStoragePath(getCrumbPath(currentPath.split('/'), i))\">\n              {{crumb}}\n            </button>\n            }\n          }\n        </span>\n\n        <button mat-icon-button type=\"button\" (click)=\"reload()\">\n          <mat-icon fontIcon=\"refresh\" />\n        </button>\n        <button mat-icon-button type=\"button\" (click)=\"createNewFolder()\">\n          <mat-icon fontIcon=\"create_new_folder\" />\n        </button>\n        <div>\n          <button mat-flat-button type=\"button\" color=\"primary\"\n                  (click)=\"inputUpload.click()\">Upload</button>\n        </div>\n      </header>\n    } @else {\n      <header class=\"header items-selected\">\n        <button mat-icon-button type=\"button\" (click)=\"selection.clear()\">\n          <mat-icon fontIcon=\"close\" />\n        </button>\n        <span>{{selection.selected.length}} {{selection.selected.length === 1 ? 'item' : 'items'}}</span>\n         \n        <button mat-raised-button type=\"button\" color=\"accent\" [disabled]=\"selectionIncludesFolder\"\n                (click)=\"downloadFiles(selection.selected)\">Download files</button>\n        <button mat-stroked-button type=\"button\"\n                (click)=\"deleteItems(selection.selected)\">Delete</button>\n      </header>\n    }\n\n    <div class=\"content\">\n      <div class=\"table-sidebar\">\n        <div class=\"table-wrapper\" [ngClass]=\"{'grid-column-end-span-8': selectedFile}\">\n          <table mat-table [dataSource]=\"items\">\n            <!-- Checkbox Column -->\n            <ng-container matColumnDef=\"checkbox\">\n              <th *matHeaderCellDef mat-header-cell class=\"checkbox-column\">\n                 \n                <mat-checkbox name=\"select-all\" [checked]=\"allItemsSelected(items)\" [indeterminate]=\"allItemsIndeterminate(items)\"\n                              [disabled]=\"items.length === 0\"\n                              (change)=\"toggleAllItems($event.checked, items)\" />\n              </th>\n              <td *matCellDef=\"let item\" mat-cell class=\"checkbox-column\">\n                 \n                <mat-checkbox [checked]=\"selection.isSelected(item)\"\n                              (click)=\"$event.stopPropagation()\"\n                              (change)=\"selection.toggle(item)\" />\n              </td>\n            </ng-container>\n\n            <!-- Name Column -->\n            <ng-container matColumnDef=\"name\">\n              <th *matHeaderCellDef mat-header-cell> Name </th>\n              <td *matCellDef=\"let item\" mat-cell class=\"name-column\">\n                <anon-storage-item-icon [type]=\"item.type\" [contentType]=\"item.contentType\" />\n                <span>{{item.name}}</span>\n              </td>\n            </ng-container>\n\n            <!-- Size Column -->\n            <ng-container matColumnDef=\"size\">\n              <th *matHeaderCellDef mat-header-cell> Size </th>\n              <td *matCellDef=\"let item\" mat-cell>\n                {{item.type === 'folder' ? '&mdash;' : item.size | formatBytes}}\n              </td>\n            </ng-container>\n\n            <!-- Type Column -->\n            <ng-container matColumnDef=\"type\">\n              <th *matHeaderCellDef mat-header-cell> Type </th>\n              <td *matCellDef=\"let item\" mat-cell>\n                {{item.type === 'folder' ? 'Folder' : item.contentType}}\n              </td>\n            </ng-container>\n\n            <!-- Last Modified Column -->\n            <ng-container matColumnDef=\"lastModified\">\n              <th *matHeaderCellDef mat-header-cell> Last Modified </th>\n              <td *matCellDef=\"let item\" mat-cell>\n                {{item.type === 'folder' ? '&mdash;' : item.updated | date}}\n              </td>\n            </ng-container>\n\n            <tr *matHeaderRowDef=\"tableColumns; sticky: true\" mat-header-row></tr>\n            <tr *matRowDef=\"let item; columns: tableColumns;\" mat-row\n                [class.selected]=\"selectedFile === item\"\n                (click)=\"storageItemSelected(item)\"></tr>\n\n            <tr *matNoDataRow class=\"mat-row\">\n              <td class=\"mat-cell\" [attr.colspan]=\"tableColumns.length\">\n                <div anonFileDropzone class=\"empty-folder\"\n                     hoverClass=\"hovering\" tabindex=\"0\"\n                     (click)=\"inputUpload.click()\"\n                     (keyup)=\"inputUpload.click()\"\n                     (dropped)=\"uploadItems($event)\">\n                  <div>No files found</div>\n                  <div>Drag and drop files to upload</div>\n                </div>\n              </td>\n            </tr>\n          </table>\n        </div>\n\n        @if (selectedFile) {\n          <aside class=\"sidebar grid-column-end-span-4\">\n            <anon-storage-file-preview [item]=\"selectedFile\" (_close)=\"selectedFile = undefined\" />\n          </aside>\n        }\n      </div>\n    </div>\n  </div>\n} @else {\n  <anon-loading-or-error [error]=\"error\" />\n}\n", styles: [".card{display:flex;flex-direction:column;border-radius:1rem;overflow:hidden}header.header{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 1rem}header.header.items-selected{justify-content:flex-start;gap:1rem}header.header.items-selected mat-icon{color:inherit}.crumbs{flex-grow:1;display:flex;align-items:center;width:100px;overflow-x:auto;overflow-y:hidden}.inputUpload{display:none}.content{display:flex;flex-direction:column;overflow:hidden}.table-sidebar{width:100%;display:grid;margin:0;grid-gap:1.5rem;grid-template-columns:repeat(12,minmax(0,1fr));overflow:hidden}.table-wrapper{grid-column-end:span 12;border-top-width:1px;border-top-style:solid;border-bottom-width:1px;border-bottom-style:solid;display:inline-flex;flex-direction:column;overflow:auto;border-radius:0 0 8px 8px;width:100%}table{min-width:100%;border:0;white-space:nowrap;border-collapse:collapse;table-layout:fixed}.checkbox-column{width:64px}.name-column{max-width:50vw;display:flex;align-items:center;height:auto;min-height:52px;overflow-wrap:break-word;white-space:pre;padding:.75rem 1rem .75rem 0}.name-column span{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;width:100%}aside.sidebar{width:auto;margin:0}td{border:none!important}.mat-mdc-header-cell,.mat-mdc-cell{height:auto;min-height:52px;padding:0 1rem}.mat-mdc-row{cursor:pointer}.empty-folder{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:200px;height:100%}.grid-column-end-span-4{grid-column-end:span 4}.grid-column-end-span-8{grid-column-end:span 8}.grid-column-end-span-12{grid-column-end:span 12}\n"], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "ngmodule", type: MatButtonModule }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: i5.MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i1$1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatTableModule }, { kind: "component", type: i6.MatTable, selector: "mat-table, table[mat-table]", exportAs: ["matTable"] }, { kind: "directive", type: i6.MatHeaderCellDef, selector: "[matHeaderCellDef]" }, { kind: "directive", type: i6.MatHeaderRowDef, selector: "[matHeaderRowDef]", inputs: ["matHeaderRowDef", "matHeaderRowDefSticky"] }, { kind: "directive", type: i6.MatColumnDef, selector: "[matColumnDef]", inputs: ["matColumnDef"] }, { kind: "directive", type: i6.MatCellDef, selector: "[matCellDef]" }, { kind: "directive", type: i6.MatRowDef, selector: "[matRowDef]", inputs: ["matRowDefColumns", "matRowDefWhen"] }, { kind: "directive", type: i6.MatHeaderCell, selector: "mat-header-cell, th[mat-header-cell]" }, { kind: "directive", type: i6.MatCell, selector: "mat-cell, td[mat-cell]" }, { kind: "component", type: i6.MatHeaderRow, selector: "mat-header-row, tr[mat-header-row]", exportAs: ["matHeaderRow"] }, { kind: "component", type: i6.MatRow, selector: "mat-row, tr[mat-row]", exportAs: ["matRow"] }, { kind: "directive", type: i6.MatNoDataRow, selector: "ng-template[matNoDataRow]" }, { kind: "ngmodule", type: MatCheckboxModule }, { kind: "component", type: i7.MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "component", type: StorageItemIconComponent, selector: "anon-storage-item-icon", inputs: ["type", "contentType"] }, { kind: "pipe", type: FormatBytesPipe, name: "formatBytes" }, { kind: "pipe", type: DatePipe, name: "date" }, { kind: "component", type: StorageFilePreviewComponent, selector: "anon-storage-file-preview", inputs: ["item"], outputs: ["_close"] }, { kind: "directive", type: FileDropzoneDirective, selector: "[anonFileDropzone]", inputs: ["hoverClass"], outputs: ["dropped", "hovered"] }, { kind: "component", type: LoadingOrErrorComponent, selector: "anon-loading-or-error", inputs: ["error"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FileManagerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-file-manager', standalone: true, imports: [
                        AsyncPipe,
                        MatButtonModule,
                        MatIconModule,
                        MatTableModule,
                        MatCheckboxModule,
                        StorageItemIconComponent,
                        FormatBytesPipe,
                        DatePipe,
                        StorageFilePreviewComponent,
                        FileDropzoneDirective,
                        LoadingOrErrorComponent,
                        NgClass,
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (items$ | async; as items) {\n  <div class=\"card\">\n    <input #inputUpload multiple class=\"inputUpload\"\n           type=\"file\" autocomplete=\"off\" tabindex=\"-1\"\n           (change)=\"onFilesSelect($event)\" />\n     \n    @if (selection.isEmpty()) {\n      <header class=\"header\">\n        <!-- Crumbs -->\n        <span class=\"crumbs\">\n          <button mat-icon-button type=\"button\"\n                  [disabled]=\"currentPath===rootStoragePath\"\n                  (click)=\"setStoragePath(rootStoragePath)\">\n            <mat-icon fontIcon=\"home\" />\n          </button>\n           \n          @for (crumb of currentPath.split('/'); track crumb;let i=$index; let last=$last) {\n            @if (crumb !== rootStoragePath) {\n              @if (currentPath!==rootStoragePath) {\n                <mat-icon class=\"overflow-visible\" fontIcon=\"chevron_right\" />\n              }\n              <button mat-button type=\"button\" [disabled]=\"last\"\n                      (click)=\"setStoragePath(getCrumbPath(currentPath.split('/'), i))\">\n              {{crumb}}\n            </button>\n            }\n          }\n        </span>\n\n        <button mat-icon-button type=\"button\" (click)=\"reload()\">\n          <mat-icon fontIcon=\"refresh\" />\n        </button>\n        <button mat-icon-button type=\"button\" (click)=\"createNewFolder()\">\n          <mat-icon fontIcon=\"create_new_folder\" />\n        </button>\n        <div>\n          <button mat-flat-button type=\"button\" color=\"primary\"\n                  (click)=\"inputUpload.click()\">Upload</button>\n        </div>\n      </header>\n    } @else {\n      <header class=\"header items-selected\">\n        <button mat-icon-button type=\"button\" (click)=\"selection.clear()\">\n          <mat-icon fontIcon=\"close\" />\n        </button>\n        <span>{{selection.selected.length}} {{selection.selected.length === 1 ? 'item' : 'items'}}</span>\n         \n        <button mat-raised-button type=\"button\" color=\"accent\" [disabled]=\"selectionIncludesFolder\"\n                (click)=\"downloadFiles(selection.selected)\">Download files</button>\n        <button mat-stroked-button type=\"button\"\n                (click)=\"deleteItems(selection.selected)\">Delete</button>\n      </header>\n    }\n\n    <div class=\"content\">\n      <div class=\"table-sidebar\">\n        <div class=\"table-wrapper\" [ngClass]=\"{'grid-column-end-span-8': selectedFile}\">\n          <table mat-table [dataSource]=\"items\">\n            <!-- Checkbox Column -->\n            <ng-container matColumnDef=\"checkbox\">\n              <th *matHeaderCellDef mat-header-cell class=\"checkbox-column\">\n                 \n                <mat-checkbox name=\"select-all\" [checked]=\"allItemsSelected(items)\" [indeterminate]=\"allItemsIndeterminate(items)\"\n                              [disabled]=\"items.length === 0\"\n                              (change)=\"toggleAllItems($event.checked, items)\" />\n              </th>\n              <td *matCellDef=\"let item\" mat-cell class=\"checkbox-column\">\n                 \n                <mat-checkbox [checked]=\"selection.isSelected(item)\"\n                              (click)=\"$event.stopPropagation()\"\n                              (change)=\"selection.toggle(item)\" />\n              </td>\n            </ng-container>\n\n            <!-- Name Column -->\n            <ng-container matColumnDef=\"name\">\n              <th *matHeaderCellDef mat-header-cell> Name </th>\n              <td *matCellDef=\"let item\" mat-cell class=\"name-column\">\n                <anon-storage-item-icon [type]=\"item.type\" [contentType]=\"item.contentType\" />\n                <span>{{item.name}}</span>\n              </td>\n            </ng-container>\n\n            <!-- Size Column -->\n            <ng-container matColumnDef=\"size\">\n              <th *matHeaderCellDef mat-header-cell> Size </th>\n              <td *matCellDef=\"let item\" mat-cell>\n                {{item.type === 'folder' ? '&mdash;' : item.size | formatBytes}}\n              </td>\n            </ng-container>\n\n            <!-- Type Column -->\n            <ng-container matColumnDef=\"type\">\n              <th *matHeaderCellDef mat-header-cell> Type </th>\n              <td *matCellDef=\"let item\" mat-cell>\n                {{item.type === 'folder' ? 'Folder' : item.contentType}}\n              </td>\n            </ng-container>\n\n            <!-- Last Modified Column -->\n            <ng-container matColumnDef=\"lastModified\">\n              <th *matHeaderCellDef mat-header-cell> Last Modified </th>\n              <td *matCellDef=\"let item\" mat-cell>\n                {{item.type === 'folder' ? '&mdash;' : item.updated | date}}\n              </td>\n            </ng-container>\n\n            <tr *matHeaderRowDef=\"tableColumns; sticky: true\" mat-header-row></tr>\n            <tr *matRowDef=\"let item; columns: tableColumns;\" mat-row\n                [class.selected]=\"selectedFile === item\"\n                (click)=\"storageItemSelected(item)\"></tr>\n\n            <tr *matNoDataRow class=\"mat-row\">\n              <td class=\"mat-cell\" [attr.colspan]=\"tableColumns.length\">\n                <div anonFileDropzone class=\"empty-folder\"\n                     hoverClass=\"hovering\" tabindex=\"0\"\n                     (click)=\"inputUpload.click()\"\n                     (keyup)=\"inputUpload.click()\"\n                     (dropped)=\"uploadItems($event)\">\n                  <div>No files found</div>\n                  <div>Drag and drop files to upload</div>\n                </div>\n              </td>\n            </tr>\n          </table>\n        </div>\n\n        @if (selectedFile) {\n          <aside class=\"sidebar grid-column-end-span-4\">\n            <anon-storage-file-preview [item]=\"selectedFile\" (_close)=\"selectedFile = undefined\" />\n          </aside>\n        }\n      </div>\n    </div>\n  </div>\n} @else {\n  <anon-loading-or-error [error]=\"error\" />\n}\n", styles: [".card{display:flex;flex-direction:column;border-radius:1rem;overflow:hidden}header.header{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 1rem}header.header.items-selected{justify-content:flex-start;gap:1rem}header.header.items-selected mat-icon{color:inherit}.crumbs{flex-grow:1;display:flex;align-items:center;width:100px;overflow-x:auto;overflow-y:hidden}.inputUpload{display:none}.content{display:flex;flex-direction:column;overflow:hidden}.table-sidebar{width:100%;display:grid;margin:0;grid-gap:1.5rem;grid-template-columns:repeat(12,minmax(0,1fr));overflow:hidden}.table-wrapper{grid-column-end:span 12;border-top-width:1px;border-top-style:solid;border-bottom-width:1px;border-bottom-style:solid;display:inline-flex;flex-direction:column;overflow:auto;border-radius:0 0 8px 8px;width:100%}table{min-width:100%;border:0;white-space:nowrap;border-collapse:collapse;table-layout:fixed}.checkbox-column{width:64px}.name-column{max-width:50vw;display:flex;align-items:center;height:auto;min-height:52px;overflow-wrap:break-word;white-space:pre;padding:.75rem 1rem .75rem 0}.name-column span{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;width:100%}aside.sidebar{width:auto;margin:0}td{border:none!important}.mat-mdc-header-cell,.mat-mdc-cell{height:auto;min-height:52px;padding:0 1rem}.mat-mdc-row{cursor:pointer}.empty-folder{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:200px;height:100%}.grid-column-end-span-4{grid-column-end:span 4}.grid-column-end-span-8{grid-column-end:span 8}.grid-column-end-span-12{grid-column-end:span 12}\n"] }]
        }], ctorParameters: () => [{ type: i1.MatDialog }, { type: ConsoleLoggerService }, { type: FirebaseStorageService }], propDecorators: { selection: [{
                type: Input
            }], selectedFile: [{
                type: Input
            }], rootStoragePath: [{
                type: Input
            }] } });

/*
 * Public API Surface of angular-firebase-storage-manager
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ConsoleLoggerService, FileManagerComponent, FirebaseStorageService };
//# sourceMappingURL=angular-firebase-storage-manager.mjs.map
