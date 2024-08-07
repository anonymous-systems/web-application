import { ElementRef, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FileDropzoneDirective {
    private elementRef;
    /**
     * Emits a FileList when files are dropped onto the host element.
     *
     * @event
     */
    readonly dropped: EventEmitter<FileList>;
    /**
     * Emits a boolean indicating whether the host element is currently being
     * hovered over during a drag operation.
     *
     * @event
     */
    readonly hovered: EventEmitter<boolean>;
    /**
     * The CSS class to apply to the host element when it's being hovered over.
     * Defaults to 'hovered'.
     */
    hoverClass: string;
    constructor(elementRef: ElementRef);
    /**
     * Handles the 'drop' event, emitting the dropped files and preventing
     * default behavior.
     *
     * @param {$event} $event - The DragEvent containing the dropped files.
     */
    onDrop($event: DragEvent): void;
    /**
     * Handles the 'dragover' event, adding a hover class and emitting a
     * 'hovered' event with a value of 'true'. Prevents default behavior.
     *
     * @param {$event} $event - The DragEvent.
     */
    onDragOver($event: DragEvent): void;
    /**
     * Handles the 'dragleave' event, removing the hover class and emitting
     * a 'hovered' event with a value of 'false'. Prevents default behavior.
     *
     * @param {$event} $event - The DragEvent.
     */
    onDragLeave($event: DragEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileDropzoneDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FileDropzoneDirective, "[anonFileDropzone]", never, { "hoverClass": { "alias": "hoverClass"; "required": false; }; }, { "dropped": "dropped"; "hovered": "hovered"; }, never, never, true, never>;
}
