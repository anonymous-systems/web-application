import { Directive, HostListener, Input, Output, EventEmitter, } from '@angular/core';
import * as i0 from "@angular/core";
export class FileDropzoneDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1kcm9wem9uZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWZpcmViYXNlLXN0b3JhZ2UtbWFuYWdlci9zcmMvbGliL2RpcmVjdGl2ZXMvZmlsZS1kcm9wem9uZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFDMUIsWUFBWSxHQUN6QixNQUFNLGVBQWUsQ0FBQzs7QUFNdkIsTUFBTSxPQUFPLHFCQUFxQjtJQW9CaEMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQW5CMUM7Ozs7V0FJRztRQUNnQixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQVksQ0FBQztRQUMxRDs7Ozs7V0FLRztRQUNnQixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN6RDs7O1dBR0c7UUFDTSxlQUFVLEdBQUcsU0FBUyxDQUFDO0lBRWEsQ0FBQztJQUU5Qzs7Ozs7T0FLRztJQUVILE1BQU0sQ0FBQyxNQUFpQjtRQUN0QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUVILFVBQVUsQ0FBQyxNQUFpQjtRQUMxQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBRUgsV0FBVyxDQUFDLE1BQWlCO1FBQzNCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDOzhHQTNEVSxxQkFBcUI7a0dBQXJCLHFCQUFxQjs7MkZBQXJCLHFCQUFxQjtrQkFKakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixVQUFVLEVBQUUsSUFBSTtpQkFDakI7K0VBT29CLE9BQU87c0JBQXpCLE1BQU07Z0JBT1ksT0FBTztzQkFBekIsTUFBTTtnQkFLRSxVQUFVO3NCQUFsQixLQUFLO2dCQVdOLE1BQU07c0JBREwsWUFBWTt1QkFBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBY2hDLFVBQVU7c0JBRFQsWUFBWTt1QkFBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBY3BDLFdBQVc7c0JBRFYsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE91dHB1dCxcbiAgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Fub25GaWxlRHJvcHpvbmVdJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgRmlsZURyb3B6b25lRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEVtaXRzIGEgRmlsZUxpc3Qgd2hlbiBmaWxlcyBhcmUgZHJvcHBlZCBvbnRvIHRoZSBob3N0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBldmVudFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyb3BwZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVMaXN0PigpO1xuICAvKipcbiAgICogRW1pdHMgYSBib29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGUgaG9zdCBlbGVtZW50IGlzIGN1cnJlbnRseSBiZWluZ1xuICAgKiBob3ZlcmVkIG92ZXIgZHVyaW5nIGEgZHJhZyBvcGVyYXRpb24uXG4gICAqXG4gICAqIEBldmVudFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGhvdmVyZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIC8qKlxuICAgKiBUaGUgQ1NTIGNsYXNzIHRvIGFwcGx5IHRvIHRoZSBob3N0IGVsZW1lbnQgd2hlbiBpdCdzIGJlaW5nIGhvdmVyZWQgb3Zlci5cbiAgICogRGVmYXVsdHMgdG8gJ2hvdmVyZWQnLlxuICAgKi9cbiAgQElucHV0KCkgaG92ZXJDbGFzcyA9ICdob3ZlcmVkJztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlICdkcm9wJyBldmVudCwgZW1pdHRpbmcgdGhlIGRyb3BwZWQgZmlsZXMgYW5kIHByZXZlbnRpbmdcbiAgICogZGVmYXVsdCBiZWhhdmlvci5cbiAgICpcbiAgICogQHBhcmFtIHskZXZlbnR9ICRldmVudCAtIFRoZSBEcmFnRXZlbnQgY29udGFpbmluZyB0aGUgZHJvcHBlZCBmaWxlcy5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxuICBvbkRyb3AoJGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmRyb3BwZWQuZW1pdCgkZXZlbnQuZGF0YVRyYW5zZmVyPy5maWxlcyk7XG4gICAgdGhpcy5vbkRyYWdMZWF2ZSgkZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlICdkcmFnb3ZlcicgZXZlbnQsIGFkZGluZyBhIGhvdmVyIGNsYXNzIGFuZCBlbWl0dGluZyBhXG4gICAqICdob3ZlcmVkJyBldmVudCB3aXRoIGEgdmFsdWUgb2YgJ3RydWUnLiBQcmV2ZW50cyBkZWZhdWx0IGJlaGF2aW9yLlxuICAgKlxuICAgKiBAcGFyYW0geyRldmVudH0gJGV2ZW50IC0gVGhlIERyYWdFdmVudC5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcbiAgb25EcmFnT3ZlcigkZXZlbnQ6IERyYWdFdmVudCkge1xuICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5ob3ZlckNsYXNzKTtcbiAgICB0aGlzLmhvdmVyZWQuZW1pdCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSAnZHJhZ2xlYXZlJyBldmVudCwgcmVtb3ZpbmcgdGhlIGhvdmVyIGNsYXNzIGFuZCBlbWl0dGluZ1xuICAgKiBhICdob3ZlcmVkJyBldmVudCB3aXRoIGEgdmFsdWUgb2YgJ2ZhbHNlJy4gUHJldmVudHMgZGVmYXVsdCBiZWhhdmlvci5cbiAgICpcbiAgICogQHBhcmFtIHskZXZlbnR9ICRldmVudCAtIFRoZSBEcmFnRXZlbnQuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKVxuICBvbkRyYWdMZWF2ZSgkZXZlbnQ6IERyYWdFdmVudCkge1xuICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5ob3ZlckNsYXNzKTtcbiAgICB0aGlzLmhvdmVyZWQuZW1pdChmYWxzZSk7XG4gIH1cbn1cbiJdfQ==