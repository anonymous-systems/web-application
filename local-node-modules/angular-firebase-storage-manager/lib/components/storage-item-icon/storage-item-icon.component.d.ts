import * as i0 from "@angular/core";
export declare class StorageItemIconComponent {
    /**
     * The type of item to represent.
     * Can be either 'file' or 'folder'. Defaults to 'folder'.
     */
    type: 'file' | 'folder';
    /**
     * The MIME content type of a file item (optional).
     * Used for more specific icon selection.
     */
    contentType?: string;
    /**
     * A mapping of MIME content types to Material Design icon names.
     * Used for determining specific icons for different file types.
     * @private
     */
    private readonly MIME_TYPE_ICON_MAP;
    /**
     * A default Material Design icon name used when a specific
     * content type match is not found.
     * @private
     */
    private readonly DEFAULT_MIME_TYPE_ICON;
    /**
     * Determines the appropriate Material Design icon name based on
     * the provided content type or a default.
     *
     * @param {string} contentType - The MIME content type of the file (optional).
     * @return {string} The name of the Material Design icon to use.
     */
    getFileIcon(contentType?: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<StorageItemIconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StorageItemIconComponent, "anon-storage-item-icon", never, { "type": { "alias": "type"; "required": false; }; "contentType": { "alias": "contentType"; "required": false; }; }, {}, never, never, true, never>;
}
