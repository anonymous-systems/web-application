import { MatDialogRef } from '@angular/material/dialog';
import * as i0 from "@angular/core";
/**
 * Defines the data contract for information passed to the
 * NewFolderDialogComponent.
 */
export interface NewFolderDialogContract {
    folderName: string;
    path: string;
}
/**
 * Defines the data contract for information returned when
 * closing the NewFolderDialogComponent.
 */
export interface NewFolderDialogCloseContract {
    folderName: string;
}
export declare class NewFolderDialogComponent {
    data: NewFolderDialogContract;
    private dialogRef;
    /**
     * Constructor for the dialog component.
     *
     * @param {NewFolderDialogContract} data - Injected data containing initial
     * folder information.
     * @param {MatDialogRef} dialogRef - A reference to this dialog instance,
     * used for controlling its behavior.
     */
    constructor(data: NewFolderDialogContract, dialogRef: MatDialogRef<NewFolderDialogComponent>);
    /**
     * Closes the dialog and passes back the entered folder name.
     */
    createFolder(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NewFolderDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NewFolderDialogComponent, "anon-new-folder-dialog", never, {}, {}, never, never, true, never>;
}
