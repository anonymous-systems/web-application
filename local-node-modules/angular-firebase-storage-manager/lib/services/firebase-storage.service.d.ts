import { Storage, StorageReference, ListResult, UploadResult } from '@angular/fire/storage';
import { StorageFile, StorageFolder, StorageItem } from '../interfaces';
import * as i0 from "@angular/core";
export declare class FirebaseStorageService {
    private storage;
    private document;
    constructor(storage: Storage, document: Document);
    /**
     * Retrieves a StorageReference object for interacting with
     * Firebase Storage at the given path.
     *
     * @param {string} path - The desired path within Firebase Storage.
     * @return {StorageReference} A reference to the specified location.
     */
    getRef(path: string): StorageReference;
    /**
     * Lists all files and prefixes (subfolders) within a Firebase Storage
     * directory.
     *
     * @param {StorageReference} listRef - A reference to the directory to list.
     * @return {Promise<ListResult>} Resolves with the listing results.
     */
    listAll(listRef: StorageReference): Promise<ListResult>;
    /**
     * Uploads a file to Firebase Storage with metadata for correct download
     * behavior.
     *
     * @param {StorageReference} ref - Reference to the target upload location.
     * @param {File} file - The file object to upload.
     * @return {Promise<UploadResult>} Resolves with the upload results.
     */
    uploadFile(ref: StorageReference, file: File): Promise<UploadResult>;
    /**
     * Uploads multiple files in parallel, optionally placing them within a
     * folder.
     *
     * @param {File[]} files - An array of file objects to upload.
     * @param {string} [folder] - Optional folder name for the uploaded files.
     * @return {Promise<UploadResult[]>} Resolves with an array of upload results.
     */
    uploadFiles(files: File[], folder?: string): Promise<UploadResult[]>;
    /**
     * Fetches full metadata for a file in Firebase Storage and
     * constructs a StorageFile object.
     *
     * @param {StorageReference} fileRef - A reference to the file.
     * @return {Promise<StorageFile>} Resolves with the StorageFile
     * representation.
     */
    importFile(fileRef: StorageReference): Promise<StorageFile>;
    /**
     * Creates a StorageFolder object representing a Firebase Storage folder.
     *
     * @param {StorageReference} folder - A reference to the folder.
     * @return {StorageFolder}
     */
    importFolder(folder: StorageReference): StorageFolder;
    /**
     * Retrieves a direct download URL for a file in Firebase Storage.
     *
     * @param {StorageReference} ref - A reference to the file.
     * @return {Promise<string>} Resolves with the download URL string.
     */
    getDownloadURL(ref: StorageReference): Promise<string>;
    /**
     * Opens all provided files in new browser tabs by generating download URLs
     * and triggering download links.
     *
     * @param {StorageItem[]} files - An array of StorageItem objects
     * representing files.
     */
    openAllFiles(files: StorageItem[]): Promise<void>;
    /**
     * Recursively deletes a folder and its contents from Firebase Storage.
     * Handles potential errors if the physical folder doesn't exist.
     *
     * @param {string} path - The full path of the folder to delete.
     */
    deleteFolder(path: string): Promise<void>;
    /**
     * Deletes a file from Firebase Storage.
     *
     * @param {string} path - The full path to the file.
     */
    deleteFile(path: string): Promise<void>;
    /**
     * Deletes multiple files or folders from Firebase Storage.
     *
     * @param {StorageItem[]} items - An array of StorageItem objects.
     */
    deleteFiles(items: StorageItem[]): Promise<void[]>;
    /**
     * Helper function to create a download link element.
     *
     * @param {string} url - The download URL for the file.
     * @return {HTMLAnchorElement} A configured anchor element for triggering
     * a download.
     */
    createAnchorElement(url: string): HTMLAnchorElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<FirebaseStorageService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FirebaseStorageService>;
}
