import { Inject, Injectable } from '@angular/core';
import { listAll, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject, } from '@angular/fire/storage';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/fire/storage";
export class FirebaseStorageService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FirebaseStorageService, deps: [{ token: i1.Storage }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FirebaseStorageService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: FirebaseStorageService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.Storage }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWJhc2Utc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1maXJlYmFzZS1zdG9yYWdlLW1hbmFnZXIvc3JjL2xpYi9zZXJ2aWNlcy9maXJlYmFzZS1zdG9yYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUVPLE9BQU8sRUFBRSxHQUFHLEVBQ3hCLFdBQVcsRUFDRyxjQUFjLEVBQzVCLFdBQVcsRUFBRSxZQUFZLEdBQzFCLE1BQU0sdUJBQXVCLENBQUM7QUFFL0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7QUFHekMsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUNVLE9BQWdCLEVBQ0UsUUFBa0I7UUFEcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNFLGFBQVEsR0FBUixRQUFRLENBQVU7SUFDM0MsQ0FBQztJQUVKOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFZO1FBQ2pCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBeUI7UUFDckMsT0FBTyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBcUIsRUFBRSxJQUFVO1FBQ2hEOzs7Z0NBR3dCO1FBQ3hCLE1BQU0sUUFBUSxHQUFHO1lBQ2Ysa0JBQWtCLEVBQUUsd0JBQXdCLElBQUksQ0FBQyxJQUFJLEVBQUU7U0FDeEQsQ0FBQztRQUNGLE9BQU8sTUFBTSxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFB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O1FBQ3BCLENBQUMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDO1FBQ25CLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs4R0E3TFUsc0JBQXNCLHlDQUd2QixRQUFRO2tIQUhQLHNCQUFzQixjQURWLE1BQU07OzJGQUNsQixzQkFBc0I7a0JBRGxDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFJM0IsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgU3RvcmFnZSwgU3RvcmFnZVJlZmVyZW5jZSxcbiAgTGlzdFJlc3VsdCwgbGlzdEFsbCwgcmVmLFxuICB1cGxvYWRCeXRlcywgVXBsb2FkUmVzdWx0LFxuICBGdWxsTWV0YWRhdGEsIGdldERvd25sb2FkVVJMLFxuICBnZXRNZXRhZGF0YSwgZGVsZXRlT2JqZWN0LFxufSBmcm9tICdAYW5ndWxhci9maXJlL3N0b3JhZ2UnO1xuaW1wb3J0IHtTdG9yYWdlRmlsZSwgU3RvcmFnZUZvbGRlciwgU3RvcmFnZUl0ZW19IGZyb20gJy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgRmlyZWJhc2VTdG9yYWdlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCxcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBTdG9yYWdlUmVmZXJlbmNlIG9iamVjdCBmb3IgaW50ZXJhY3Rpbmcgd2l0aFxuICAgKiBGaXJlYmFzZSBTdG9yYWdlIGF0IHRoZSBnaXZlbiBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIFRoZSBkZXNpcmVkIHBhdGggd2l0aGluIEZpcmViYXNlIFN0b3JhZ2UuXG4gICAqIEByZXR1cm4ge1N0b3JhZ2VSZWZlcmVuY2V9IEEgcmVmZXJlbmNlIHRvIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXG4gICAqL1xuICBnZXRSZWYocGF0aDogc3RyaW5nKTogU3RvcmFnZVJlZmVyZW5jZSB7XG4gICAgcmV0dXJuIHJlZih0aGlzLnN0b3JhZ2UsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RzIGFsbCBmaWxlcyBhbmQgcHJlZml4ZXMgKHN1YmZvbGRlcnMpIHdpdGhpbiBhIEZpcmViYXNlIFN0b3JhZ2VcbiAgICogZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0b3JhZ2VSZWZlcmVuY2V9IGxpc3RSZWYgLSBBIHJlZmVyZW5jZSB0byB0aGUgZGlyZWN0b3J5IHRvIGxpc3QuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8TGlzdFJlc3VsdD59IFJlc29sdmVzIHdpdGggdGhlIGxpc3RpbmcgcmVzdWx0cy5cbiAgICovXG4gIGFzeW5jIGxpc3RBbGwobGlzdFJlZjogU3RvcmFnZVJlZmVyZW5jZSk6IFByb21pc2U8TGlzdFJlc3VsdD4ge1xuICAgIHJldHVybiBhd2FpdCBsaXN0QWxsKGxpc3RSZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwbG9hZHMgYSBmaWxlIHRvIEZpcmViYXNlIFN0b3JhZ2Ugd2l0aCBtZXRhZGF0YSBmb3IgY29ycmVjdCBkb3dubG9hZFxuICAgKiBiZWhhdmlvci5cbiAgICpcbiAgICogQHBhcmFtIHtTdG9yYWdlUmVmZXJlbmNlfSByZWYgLSBSZWZlcmVuY2UgdG8gdGhlIHRhcmdldCB1cGxvYWQgbG9jYXRpb24uXG4gICAqIEBwYXJhbSB7RmlsZX0gZmlsZSAtIFRoZSBmaWxlIG9iamVjdCB0byB1cGxvYWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8VXBsb2FkUmVzdWx0Pn0gUmVzb2x2ZXMgd2l0aCB0aGUgdXBsb2FkIHJlc3VsdHMuXG4gICAqL1xuICBhc3luYyB1cGxvYWRGaWxlKHJlZjogU3RvcmFnZVJlZmVyZW5jZSwgZmlsZTogRmlsZSk6IFByb21pc2U8VXBsb2FkUmVzdWx0PiB7XG4gICAgLypcbiAgICAqIHNldCBjb250ZW50IGRpc3Bvc2l0aW9uIHRvIHNob3cgZmlsZW5hbWUgaW5zdGVhZCBvZiBwYXRoIG9uIGRvd25sb2Fkc1xuICAgICogZmlsZSBuYW1lIGNhbm5vdCBjb250YWluIGEgXCIsXCIoY29tbWEpLCBpdCB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZVxuICAgICogY29udGVudCBkaXNwb3NpdGlvbiAqL1xuICAgIGNvbnN0IG1ldGFkYXRhID0ge1xuICAgICAgY29udGVudERpc3Bvc2l0aW9uOiBgYXR0YWNobWVudDsgZmlsZW5hbWU9JHtmaWxlLm5hbWV9YCxcbiAgICB9O1xuICAgIHJldHVybiBhd2FpdCB1cGxvYWRCeXRlcyhyZWYsIGZpbGUsIG1ldGFkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGxvYWRzIG11bHRpcGxlIGZpbGVzIGluIHBhcmFsbGVsLCBvcHRpb25hbGx5IHBsYWNpbmcgdGhlbSB3aXRoaW4gYVxuICAgKiBmb2xkZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7RmlsZVtdfSBmaWxlcyAtIEFuIGFycmF5IG9mIGZpbGUgb2JqZWN0cyB0byB1cGxvYWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZm9sZGVyXSAtIE9wdGlvbmFsIGZvbGRlciBuYW1lIGZvciB0aGUgdXBsb2FkZWQgZmlsZXMuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8VXBsb2FkUmVzdWx0W10+fSBSZXNvbHZlcyB3aXRoIGFuIGFycmF5IG9mIHVwbG9hZCByZXN1bHRzLlxuICAgKi9cbiAgYXN5bmMgdXBsb2FkRmlsZXMoZmlsZXM6IEZpbGVbXSwgZm9sZGVyPzogc3RyaW5nKTogUHJvbWlzZTxVcGxvYWRSZXN1bHRbXT4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChmaWxlcy5tYXAoYXN5bmMgKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBmb2xkZXIgPyBgJHtmb2xkZXJ9LyR7ZmlsZS5uYW1lfWAgOiBmaWxlLm5hbWU7XG4gICAgICBjb25zdCBmaWxlUmVmID0gdGhpcy5nZXRSZWYocGF0aCk7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy51cGxvYWRGaWxlKGZpbGVSZWYsIGZpbGUpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaGVzIGZ1bGwgbWV0YWRhdGEgZm9yIGEgZmlsZSBpbiBGaXJlYmFzZSBTdG9yYWdlIGFuZFxuICAgKiBjb25zdHJ1Y3RzIGEgU3RvcmFnZUZpbGUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0b3JhZ2VSZWZlcmVuY2V9IGZpbGVSZWYgLSBBIHJlZmVyZW5jZSB0byB0aGUgZmlsZS5cbiAgICogQHJldHVybiB7UHJvbWlzZTxTdG9yYWdlRmlsZT59IFJlc29sdmVzIHdpdGggdGhlIFN0b3JhZ2VGaWxlXG4gICAqIHJlcHJlc2VudGF0aW9uLlxuICAgKi9cbiAgYXN5bmMgaW1wb3J0RmlsZShmaWxlUmVmOiBTdG9yYWdlUmVmZXJlbmNlKTogUHJvbWlzZTxTdG9yYWdlRmlsZT4ge1xuICAgIGNvbnN0IG1ldGFkYXRhOiBGdWxsTWV0YWRhdGEgPSBhd2FpdCBnZXRNZXRhZGF0YShmaWxlUmVmKTtcbiAgICByZXR1cm4ge3R5cGU6ICdmaWxlJywgLi4ubWV0YWRhdGF9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBTdG9yYWdlRm9sZGVyIG9iamVjdCByZXByZXNlbnRpbmcgYSBGaXJlYmFzZSBTdG9yYWdlIGZvbGRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdG9yYWdlUmVmZXJlbmNlfSBmb2xkZXIgLSBBIHJlZmVyZW5jZSB0byB0aGUgZm9sZGVyLlxuICAgKiBAcmV0dXJuIHtTdG9yYWdlRm9sZGVyfVxuICAgKi9cbiAgaW1wb3J0Rm9sZGVyKGZvbGRlcjogU3RvcmFnZVJlZmVyZW5jZSk6IFN0b3JhZ2VGb2xkZXIge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZm9sZGVyJyxcbiAgICAgIG5hbWU6IGZvbGRlci5uYW1lLFxuICAgICAgZnVsbFBhdGg6IGZvbGRlci5mdWxsUGF0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGRpcmVjdCBkb3dubG9hZCBVUkwgZm9yIGEgZmlsZSBpbiBGaXJlYmFzZSBTdG9yYWdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0b3JhZ2VSZWZlcmVuY2V9IHJlZiAtIEEgcmVmZXJlbmNlIHRvIHRoZSBmaWxlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59IFJlc29sdmVzIHdpdGggdGhlIGRvd25sb2FkIFVSTCBzdHJpbmcuXG4gICAqL1xuICBhc3luYyBnZXREb3dubG9hZFVSTChyZWY6IFN0b3JhZ2VSZWZlcmVuY2UpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBnZXREb3dubG9hZFVSTChyZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGFsbCBwcm92aWRlZCBmaWxlcyBpbiBuZXcgYnJvd3NlciB0YWJzIGJ5IGdlbmVyYXRpbmcgZG93bmxvYWQgVVJMc1xuICAgKiBhbmQgdHJpZ2dlcmluZyBkb3dubG9hZCBsaW5rcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdG9yYWdlSXRlbVtdfSBmaWxlcyAtIEFuIGFycmF5IG9mIFN0b3JhZ2VJdGVtIG9iamVjdHNcbiAgICogcmVwcmVzZW50aW5nIGZpbGVzLlxuICAgKi9cbiAgYXN5bmMgb3BlbkFsbEZpbGVzKGZpbGVzOiBTdG9yYWdlSXRlbVtdKSB7XG4gICAgY29uc3QgcGF0aHMgPSBmaWxlcy5tYXAoKGZpbGUpID0+IGZpbGUuZnVsbFBhdGgpO1xuICAgIGNvbnN0IGxpbmtzID0gYXdhaXQgUHJvbWlzZS5hbGwocGF0aHMubWFwKChwYXRoKSA9PiB0aGlzLmdldFJlZihwYXRoKSlcbiAgICAgICAgLm1hcCgocmVmKSA9PiB0aGlzLmdldERvd25sb2FkVVJMKHJlZikpKTtcbiAgICBsaW5rcy5mb3JFYWNoKCh1cmwpID0+IHtcbiAgICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuY3JlYXRlQW5jaG9yRWxlbWVudCh1cmwpO1xuICAgICAgYW5jaG9yLmNsaWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgZGVsZXRlcyBhIGZvbGRlciBhbmQgaXRzIGNvbnRlbnRzIGZyb20gRmlyZWJhc2UgU3RvcmFnZS5cbiAgICogSGFuZGxlcyBwb3RlbnRpYWwgZXJyb3JzIGlmIHRoZSBwaHlzaWNhbCBmb2xkZXIgZG9lc24ndCBleGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgZnVsbCBwYXRoIG9mIHRoZSBmb2xkZXIgdG8gZGVsZXRlLlxuICAgKi9cbiAgYXN5bmMgZGVsZXRlRm9sZGVyKHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHtpdGVtcywgcHJlZml4ZXN9ID0gYXdhaXQgdGhpcy5saXN0QWxsKHRoaXMuZ2V0UmVmKHBhdGgpKTtcblxuICAgIHRyeSB7XG4gICAgICAvKipcbiAgICAgICAqIFdlIGRvbid0IGtub3cgaWYgcGh5c2ljYWwgZm9sZGVyIGV4aXN0cywgb3IgaXQgaXMgaW5mZXJyZWQgZnJvbVxuICAgICAgICogbmVzdGVkIGZpbGUgcGF0aC5cbiAgICAgICAqXG4gICAgICAgKiBTbyBoZXJlIHdlIGF0dGVtcHQgdG8gZGVsZXRlIHBoeXNpY2FsIHJlcHJlc2VudGF0aW9uLCBidXQgaWYgaXQgZG9lc1xuICAgICAgICogbm90IGV4aXN0LCB3ZSBqdXN0IHN3YWxsb3cgdGhlIGVycm9yLlxuICAgICAgICovXG4gICAgICBhd2FpdCB0aGlzLmRlbGV0ZUZpbGUocGF0aCArIGAlMmZgKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIHF1aWV0bHkgc3dhbGxvdyBhbnkgZXJyb3JzLlxuICAgIH1cblxuICAgIGNvbnN0IHByZWZpeGVzUHJvbWlzZTogUHJvbWlzZTx2b2lkPltdID0gcHJlZml4ZXMubWFwKGFzeW5jIChwcmVmaXgpID0+IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmRlbGV0ZUZvbGRlcihwcmVmaXguZnVsbFBhdGgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsZXNQcm9taXNlOiBQcm9taXNlPHZvaWQ+W10gPSBpdGVtcy5tYXAoYXN5bmMgKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmRlbGV0ZUZpbGUoZmlsZS5mdWxsUGF0aCk7XG4gICAgfSk7XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChbLi4uZmlsZXNQcm9taXNlLCAuLi5wcmVmaXhlc1Byb21pc2VdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGEgZmlsZSBmcm9tIEZpcmViYXNlIFN0b3JhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIGZ1bGwgcGF0aCB0byB0aGUgZmlsZS5cbiAgICovXG4gIGFzeW5jIGRlbGV0ZUZpbGUocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGRlbGV0ZU9iamVjdCh0aGlzLmdldFJlZihwYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBtdWx0aXBsZSBmaWxlcyBvciBmb2xkZXJzIGZyb20gRmlyZWJhc2UgU3RvcmFnZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdG9yYWdlSXRlbVtdfSBpdGVtcyAtIEFuIGFycmF5IG9mIFN0b3JhZ2VJdGVtIG9iamVjdHMuXG4gICAqL1xuICBhc3luYyBkZWxldGVGaWxlcyhpdGVtczogU3RvcmFnZUl0ZW1bXSkge1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgaXRlbXMubWFwKGFzeW5jIChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0/LnR5cGUgPT09ICdmb2xkZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5kZWxldGVGb2xkZXIoaXRlbS5mdWxsUGF0aCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtPy50eXBlID09PSAnZmlsZScpIHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmRlbGV0ZUZpbGUoaXRlbS5mdWxsUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgYSBkb3dubG9hZCBsaW5rIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBUaGUgZG93bmxvYWQgVVJMIGZvciB0aGUgZmlsZS5cbiAgICogQHJldHVybiB7SFRNTEFuY2hvckVsZW1lbnR9IEEgY29uZmlndXJlZCBhbmNob3IgZWxlbWVudCBmb3IgdHJpZ2dlcmluZ1xuICAgKiBhIGRvd25sb2FkLlxuICAgKi9cbiAgY3JlYXRlQW5jaG9yRWxlbWVudCh1cmw6IHN0cmluZyk6IEhUTUxBbmNob3JFbGVtZW50IHtcbiAgICBjb25zdCBhOiBIVE1MQW5jaG9yRWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICBhLnRhcmdldCA9ICdfYmxhbmsnO1xuICAgIGEucmVsID0gJ25vb3BlbmVyJztcbiAgICByZXR1cm4gYTtcbiAgfVxufVxuIl19