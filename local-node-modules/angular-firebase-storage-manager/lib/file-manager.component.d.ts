import { OnInit } from '@angular/core';
import { FirebaseStorageService } from './services/firebase-storage.service';
import { FirebaseError } from '@angular/fire/app/firebase';
import { MatDialog } from '@angular/material/dialog';
import { StorageItem, StorageFile } from './interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { ConsoleLoggerService } from './services/console-logger.service';
import * as i0 from "@angular/core";
export declare class FileManagerComponent implements OnInit {
    private dialog;
    private cLog;
    private storageService;
    /**
     * The columns to display in the file management table.
     */
    tableColumns: string[];
    /**
     * A Promise resolving to an array of StorageItem objects representing
     * the current directory contents, or undefined if an error occurs.
     */
    items$?: Promise<StorageItem[]> | undefined;
    /**
     * The current path within the storage system.
     */
    currentPath: string;
    /**
     * Represents a potential FirebaseError encountered during file operations.
     */
    error?: FirebaseError;
    /**
     * Used for managing multiple item selection within the file manager.
     */
    selection: SelectionModel<StorageItem>;
    /**
     * The currently selected file (if any).
     */
    selectedFile: StorageFile | undefined;
    /**
     * The root path within the storage system where the file manager operates.
     */
    rootStoragePath: string;
    selectionChangeSignal: import("@angular/core").Signal<import("@angular/cdk/collections").SelectionChange<StorageItem> | undefined>;
    readonly selectionChange: import("@angular/core").OutputEmitterRef<StorageItem[] | null>;
    constructor(dialog: MatDialog, cLog: ConsoleLoggerService, storageService: FirebaseStorageService);
    ngOnInit(): void;
    /**
     * Downloads the provided files by triggering download links.
     * @param {StorageItem[]} files - The files to download.
     */
    downloadFiles(files: StorageItem[]): Promise<void>;
    /**
     * Toggles the selection of all items in the file listing.
     *
     * @param {boolean} checked - Whether to select or deselect all items.
     * @param {StorageItem[]} items - The list of file items.
     */
    toggleAllItems(checked: boolean, items: StorageItem[]): void;
    /**
     * Checks if all items in the file listing are currently selected.
     *
     * @param {StorageItem[]} items - The list of file items.
     * @return {boolean} True if all items are selected, false otherwise.
     */
    allItemsSelected(items: StorageItem[]): boolean;
    /**
     * Checks if some, but not all, items in the file listing are selected.
     *
     * @param {StorageItem[]} items - The list of file items.
     * @return {boolean} True if the selection state is indeterminate, false
     * otherwise.
     */
    allItemsIndeterminate(items: StorageItem[]): boolean;
    /**
     * Event handler for when a storage item is selected. Updates the navigation
     * if a folder is selected, or sets the selected file if a file is selected.
     *
     * @param {StorageItem} item - The selected StorageItem.
     */
    storageItemSelected(item: StorageItem): void;
    /**
     * Checks if the current selection includes at least one folder.
     *
     * @return {boolean} True if a folder is part of the selection, false
     * otherwise.
     */
    get selectionIncludesFolder(): boolean;
    /**
     * Opens a dialog to confirm deletion, and handles deleting selected items
     * if confirmed. Clears the selection and updates the file listing.
     *
     * @param {StorageItem[]} items - The items to delete.
     */
    deleteItems(items: StorageItem[]): void;
    /**
     * Constructs a breadcrumb-style path string based on the current path
     * history. Used for navigation display.
     *
     * @param {string[]} pathArray - An array of path segments.
     * @param {number} index - The index up to which path segments should be
     * included.
     * @return {string} The constructed path string.
     */
    getCrumbPath(pathArray: string[], index: number): string;
    /**
     * Updates the current path and fetches the new file listing.
     * Clears any existing selection.
     *
     * @param {string} path - The new storage path.
     */
    setStoragePath(path: string): void;
    /**
     * Retrieves and processes all items within a given storage path.
     *
     * @param {string} path - The storage path to list.
     * @return {Promise<StorageItem[]>} A Promise resolving to the items,
     * or undefined in case of error.
     */
    getAllStorageItems(path: string): Promise<StorageItem[]>;
    /**
     * Reloads the file and folder listing within the current or specified path.
     *
     * @param {string | null} path - Optional. The path to reload. If null,
     * the current path is used.
     */
    reload(path?: string | null): void;
    /**
     * Opens a dialog to create a new folder and updates folder listing
     * if successful.
     */
    createNewFolder(): void;
    /**
     * Handles file upload logic, including validation and updating the
     * file listing upon successful upload. Logs errors if encountered.
     *
     * @param {FileList} files - An optional FileList of files to upload.
     */
    uploadItems(files?: FileList): Promise<void>;
    /**
     * Event handler for file input change. Triggers the upload process.
     *
     * @param {Event} $event - The file input change event.
     */
    onFilesSelect($event: Event): Promise<void>;
    /**
     * Handles logging of errors during the file upload process.
     *
     * @param {FirebaseError} error - The Firebase error object.
     * @param {string} filename - The name of the file that failed to upload.
     */
    handleUploadError(error: FirebaseError, filename: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileManagerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileManagerComponent, "anon-file-manager", never, { "selection": { "alias": "selection"; "required": false; }; "selectedFile": { "alias": "selectedFile"; "required": false; }; "rootStoragePath": { "alias": "rootStoragePath"; "required": false; }; }, { "selectionChange": "selectionChange"; }, never, never, true, never>;
}
