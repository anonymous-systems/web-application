import { EventEmitter, OnChanges } from '@angular/core';
import { StorageFile } from '../../interfaces';
import { FirebaseStorageService } from '../../services/firebase-storage.service';
import { ConsoleLoggerService } from '../../services/console-logger.service';
import { Clipboard } from '@angular/cdk/clipboard';
import * as i0 from "@angular/core";
export declare class StorageFilePreviewComponent implements OnChanges {
    private clipboard;
    private cLog;
    private storageService;
    /**
     * The StorageFile object representing the file to preview.
     */
    item?: StorageFile;
    /**
     * Emits an event when the preview should be closed.
     * @event
     */
    readonly _close: EventEmitter<undefined>;
    /**
     * The download URL for the previewed file (if successfully generated).
     */
    downloadURL?: string;
    /**
     * Indicates whether an error occurred while generating the file preview URL.
     */
    previewError: boolean;
    constructor(clipboard: Clipboard, cLog: ConsoleLoggerService, storageService: FirebaseStorageService);
    ngOnChanges(): void;
    /**
     * Emits the '_close' event to signal that the preview should be closed.
     */
    closePreview(): void;
    onCopy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StorageFilePreviewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StorageFilePreviewComponent, "anon-storage-file-preview", never, { "item": { "alias": "item"; "required": false; }; }, { "_close": "_close"; }, never, never, true, never>;
}
