import { Injectable } from '@angular/core';
import {
  Storage, StorageReference, uploadBytes,
  UploadResult, ref, getDownloadURL,
  UploadMetadata, ListResult, listAll,
  getMetadata, FullMetadata, deleteObject,
} from '@angular/fire/storage';

type ItemPredicate = string | StorageReference;

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private storage: Storage) {}

  /**
   * Creates a StorageReference from either a string URL or an existing
   * StorageReference, providing a consistent way to reference storage items.
   *
   * @param {ItemPredicate} reference A string URL or StorageReference.
   * @return {StorageReference} A StorageReference for the provided input.
   */
  itemRef(reference: ItemPredicate): StorageReference {
    return typeof reference === 'string' ?
      ref(this.storage, reference) : reference;
  }

  /**
   * Retrieves the download URL for a storage item.
   *
   * @param {StorageReference} ref A string URL or StorageReference
   * for the item.
   * @return {Promise<void>} A Promise resolving to the download URL string.
   */
  async getURL(ref: ItemPredicate): Promise<string> {
    return await getDownloadURL(this.itemRef(ref));
  }

  /**
   * Uploads data to a specified storage location.
   *
   * @remarks
   * The upload is not resumable.
   *
   * @param {ItemPredicate} ref A string URL or StorageReference specifying
   * the upload location.
   * @param {File | Blob | ArrayBuffer | Uint8Array} data The data to upload
   * (File, Blob, ArrayBuffer, or Uint8Array).
   * @param {UploadMetadata} metadata Optional metadata to associate with
   * the uploaded data.
   * @return {Promise<UploadResult>} A Promise resolving to an UploadResult
   * object.
   */
  async uploadBytes(
    ref: ItemPredicate,
    data: File | Blob | ArrayBuffer | Uint8Array,
    metadata?: UploadMetadata
  ): Promise<UploadResult> {
    return await uploadBytes(this.itemRef(ref), data, metadata);
  }

  /**
   * Lists all files and folders (prefixes) under a storage reference,
   * handling pagination to retrieve a complete listing.
   *
   * @remarks
   * **Use with caution**: can consume significant resources for large
   * result sets. This is a helper method for calling list() repeatedly
   * until there are no more results. The default pagination size is 1000.
   *
   * **Note**: The results may not be consistent if objects are changed
   * while this operation is running.
   *
   * **Warning**: `listAll` may potentially consume too many resources
   * if there are too many results.
   *
   * @param {ItemPredicate} ref A string URL or StorageReference for
   * the listing location.
   * @return {Promise<ListResult>} A Promise resolving to a ListResult
   * containing items and prefixes.
   */
  async listAll(ref: ItemPredicate): Promise<ListResult> {
    return await listAll(this.itemRef(ref));
  }

  /**
   * Retrieves the full metadata for a storage item.
   *
   * @param {ItemPredicate} ref A string URL or StorageReference for the item.
   * @return {Promise<FullMetadata>} A Promise resolving to FullMetadata
   * for the item.
   */
  async getMetadata(ref: ItemPredicate): Promise<FullMetadata> {
    return await getMetadata(this.itemRef(ref));
  }

  /**
   * Deletes a file at the specified storage location.
   *
   * @param {ItemPredicate} ref A string URL or StorageReference for the
   * file to delete.
   * @return {Promise<void>} A Promise resolving upon successful deletion.
   *
   */
  async deleteFile(ref: ItemPredicate): Promise<void> {
    return await deleteObject(this.itemRef(ref));
  }

  /**
   * Recursively deletes a folder and all its contents at a specified
   * storage location. Handles potential errors if the physical folder
   * doesn't exist.
   *
   * @param {string} folderPath The path of the folder to delete.
   * @return {Promise<void>} A Promise resolving upon successful deletion.
   *
   */
  async deleteFolder(folderPath: string): Promise<void> {
    const { items, prefixes } = await this.listAll(this.itemRef(folderPath));

    try {
      /**
       * We don't know if physical folder exists, or it is inferred from
       * nested file path.
       *
       * So here we attempt to delete physical representation, but if it does
       * not exist, we just swallow the error.
       */
      await this.deleteFile(folderPath + `%2f`);
    } catch {
      // quietly swallow any errors.
    }

    /** delete folder sub folders */
    const prefixesPromise: Promise<void>[] = prefixes.map(async (prefix) => {
      return await this.deleteFolder(prefix.fullPath);
    });

    /** delete folder files */
    const filesPromise: Promise<void>[] = items.map(async (file) => {
      return await this.deleteFile(file.fullPath);
    });

    await Promise.all([...filesPromise, ...prefixesPromise]);
  }
}
