import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/icon";
export class StorageItemIconComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.3", type: StorageItemIconComponent, isStandalone: true, selector: "anon-storage-item-icon", inputs: { type: "type", contentType: "contentType" }, ngImport: i0, template: "@if (type === 'folder') {\n  <mat-icon class=\"material-icons-round\" fontIcon=\"folder\" />\n} @else {\n   \n  <mat-icon class=\"material-icons-round\" [fontIcon]=\"getFileIcon(contentType)\" />\n}\n", styles: ["mat-icon{color:#0000008a;margin-right:.25rem}\n"], dependencies: [{ kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i1.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: StorageItemIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-storage-item-icon', standalone: true, imports: [MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (type === 'folder') {\n  <mat-icon class=\"material-icons-round\" fontIcon=\"folder\" />\n} @else {\n   \n  <mat-icon class=\"material-icons-round\" [fontIcon]=\"getFileIcon(contentType)\" />\n}\n", styles: ["mat-icon{color:#0000008a;margin-right:.25rem}\n"] }]
        }], propDecorators: { type: [{
                type: Input
            }], contentType: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1pdGVtLWljb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1maXJlYmFzZS1zdG9yYWdlLW1hbmFnZXIvc3JjL2xpYi9jb21wb25lbnRzL3N0b3JhZ2UtaXRlbS1pY29uL3N0b3JhZ2UtaXRlbS1pY29uLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZmlyZWJhc2Utc3RvcmFnZS1tYW5hZ2VyL3NyYy9saWIvY29tcG9uZW50cy9zdG9yYWdlLWl0ZW0taWNvbi9zdG9yYWdlLWl0ZW0taWNvbi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7OztBQVVyRCxNQUFNLE9BQU8sd0JBQXdCO0lBUnJDO1FBU0U7OztXQUdHO1FBRUQsU0FBSSxHQUFzQixRQUFRLENBQUM7UUFTckMsOENBQThDO1FBRTlDLGdLQUFnSztRQUNoSzs7OztXQUlHO1FBQ2MsdUJBQWtCLEdBQTJCO1lBQzVELE1BQU07WUFDTixpQkFBaUIsRUFBRSxnQkFBZ0I7WUFDbkMsU0FBUztZQUNULFdBQVcsRUFBRSxPQUFPO1lBQ3BCLFdBQVcsRUFBRSxPQUFPO1lBQ3BCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFdBQVcsRUFBRSxPQUFPO1lBQ3BCLGVBQWUsRUFBRSxPQUFPO1lBQ3hCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLFFBQVE7WUFDUixXQUFXLEVBQUUsWUFBWTtZQUN6QixXQUFXLEVBQUUsWUFBWTtZQUN6QixZQUFZLEVBQUUsWUFBWTtZQUMxQixXQUFXLEVBQUUsWUFBWTtZQUN6QixnQkFBZ0IsRUFBRSxZQUFZO1lBQzlCLFFBQVE7WUFDUixXQUFXLEVBQUUsWUFBWTtZQUN6QixXQUFXLEVBQUUsWUFBWTtZQUN6QixZQUFZLEVBQUUsWUFBWTtZQUMxQixpQkFBaUIsRUFBRSxZQUFZO1lBQy9CLGdCQUFnQixFQUFFLFlBQVk7WUFDOUIsa0JBQWtCLEVBQUUsWUFBWTtZQUNoQyxZQUFZLEVBQUUsWUFBWTtZQUMxQixNQUFNO1lBQ04saUJBQWlCLEVBQUUsWUFBWTtZQUMvQixpQkFBaUI7WUFDakIsaUJBQWlCLEVBQUUsWUFBWTtZQUMvQixZQUFZLEVBQUUsY0FBYztTQUNwQixDQUFDO1FBQ1g7Ozs7V0FJRztRQUNjLDJCQUFzQixHQUFHLGNBQWMsQ0FBQztLQWMxRDtJQVpDOzs7Ozs7T0FNRztJQUNILFdBQVcsQ0FBQyxXQUFvQjtRQUM5QixJQUFJLENBQUMsV0FBVztZQUFFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDO1FBRXJELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUM3RSxDQUFDOzhHQXZFVSx3QkFBd0I7a0dBQXhCLHdCQUF3Qix3SUNYckMsME1BTUEsd0dERVksYUFBYTs7MkZBR1osd0JBQXdCO2tCQVJwQyxTQUFTOytCQUNFLHdCQUF3QixjQUd0QixJQUFJLFdBQ1AsQ0FBQyxhQUFhLENBQUMsbUJBQ1AsdUJBQXVCLENBQUMsTUFBTTs4QkFRN0MsSUFBSTtzQkFETCxLQUFLO2dCQVFKLFdBQVc7c0JBRFosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRJY29uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW5vbi1zdG9yYWdlLWl0ZW0taWNvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zdG9yYWdlLWl0ZW0taWNvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9zdG9yYWdlLWl0ZW0taWNvbi5jb21wb25lbnQuc2NzcycsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtNYXRJY29uTW9kdWxlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIFN0b3JhZ2VJdGVtSWNvbkNvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBpdGVtIHRvIHJlcHJlc2VudC5cbiAgICogQ2FuIGJlIGVpdGhlciAnZmlsZScgb3IgJ2ZvbGRlcicuIERlZmF1bHRzIHRvICdmb2xkZXInLlxuICAgKi9cbiAgQElucHV0KClcbiAgICB0eXBlOiAnZmlsZScgfCAnZm9sZGVyJyA9ICdmb2xkZXInO1xuXG4gIC8qKlxuICAgKiBUaGUgTUlNRSBjb250ZW50IHR5cGUgb2YgYSBmaWxlIGl0ZW0gKG9wdGlvbmFsKS5cbiAgICogVXNlZCBmb3IgbW9yZSBzcGVjaWZpYyBpY29uIHNlbGVjdGlvbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gICAgY29udGVudFR5cGU/OiBzdHJpbmc7XG5cbiAgLy8gVGhpcyBpcyBjb3BpZWQgYXMgaXMgZnJvbSBmaXJlYmFzZS10b29scy11aVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9maXJlYmFzZS9maXJlYmFzZS10b29scy11aS9ibG9iLzhhZDMxZDc0OGY2ODdiYmIwNGI4Mzg0MzBjNDYwMTIxZjlhOGUzMzgvc3JjL2NvbXBvbmVudHMvU3RvcmFnZS9jb21tb24vU3RvcmFnZUZpbGVJY29uL1N0b3JhZ2VGaWxlSWNvbi50c3hcbiAgLyoqXG4gICAqIEEgbWFwcGluZyBvZiBNSU1FIGNvbnRlbnQgdHlwZXMgdG8gTWF0ZXJpYWwgRGVzaWduIGljb24gbmFtZXMuXG4gICAqIFVzZWQgZm9yIGRldGVybWluaW5nIHNwZWNpZmljIGljb25zIGZvciBkaWZmZXJlbnQgZmlsZSB0eXBlcy5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgTUlNRV9UWVBFX0lDT05fTUFQOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIC8vIHBkZlxuICAgICdhcHBsaWNhdGlvbi9wZGYnOiAncGljdHVyZV9hc19wZGYnLFxuICAgIC8vIGltYWdlc1xuICAgICdpbWFnZS9naWYnOiAnaW1hZ2UnLFxuICAgICdpbWFnZS9qcGcnOiAnaW1hZ2UnLFxuICAgICdpbWFnZS9qcGVnJzogJ2ltYWdlJyxcbiAgICAnaW1hZ2UvcG5nJzogJ2ltYWdlJyxcbiAgICAnaW1hZ2Uvc3ZnK3htbCc6ICdpbWFnZScsXG4gICAgJ2ltYWdlL3dlYnAnOiAnaW1hZ2UnLFxuICAgIC8vIGF1ZGlvXG4gICAgJ2F1ZGlvL200YSc6ICdhdWRpb19maWxlJyxcbiAgICAnYXVkaW8vbXAzJzogJ2F1ZGlvX2ZpbGUnLFxuICAgICdhdWRpby9tcGVnJzogJ2F1ZGlvX2ZpbGUnLFxuICAgICdhdWRpby93YXYnOiAnYXVkaW9fZmlsZScsXG4gICAgJ2F1ZGlvL3gtbXMtd21hJzogJ2F1ZGlvX2ZpbGUnLFxuICAgIC8vIHZpZGVvXG4gICAgJ3ZpZGVvL2F2aSc6ICd2aWRlb19maWxlJyxcbiAgICAndmlkZW8vbXA0JzogJ3ZpZGVvX2ZpbGUnLFxuICAgICd2aWRlby9tcGVnJzogJ3ZpZGVvX2ZpbGUnLFxuICAgICd2aWRlby9xdWlja3RpbWUnOiAndmlkZW9fZmlsZScsXG4gICAgJ3ZpZGVvL3gtbXMtd212JzogJ3ZpZGVvX2ZpbGUnLFxuICAgICd2aWRlby94LW1hdHJvc2thJzogJ3ZpZGVvX2ZpbGUnLFxuICAgICd2aWRlby93ZWJwJzogJ3ZpZGVvX2ZpbGUnLFxuICAgIC8vIHppcFxuICAgICdhcHBsaWNhdGlvbi96aXAnOiAnZm9sZGVyX3ppcCcsXG4gICAgLy8gdGV4dCBkb2N1bWVudHNcbiAgICAndGV4dC9qYXZhc2NyaXB0JzogJ2phdmFzY3JpcHQnLFxuICAgICd0ZXh0L3BsYWluJzogJ3RleHRfc25pcHBldCcsXG4gIH0gYXMgY29uc3Q7XG4gIC8qKlxuICAgKiBBIGRlZmF1bHQgTWF0ZXJpYWwgRGVzaWduIGljb24gbmFtZSB1c2VkIHdoZW4gYSBzcGVjaWZpY1xuICAgKiBjb250ZW50IHR5cGUgbWF0Y2ggaXMgbm90IGZvdW5kLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBERUZBVUxUX01JTUVfVFlQRV9JQ09OID0gJ2ZpbGVfcHJlc2VudCc7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGFwcHJvcHJpYXRlIE1hdGVyaWFsIERlc2lnbiBpY29uIG5hbWUgYmFzZWQgb25cbiAgICogdGhlIHByb3ZpZGVkIGNvbnRlbnQgdHlwZSBvciBhIGRlZmF1bHQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50VHlwZSAtIFRoZSBNSU1FIGNvbnRlbnQgdHlwZSBvZiB0aGUgZmlsZSAob3B0aW9uYWwpLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBuYW1lIG9mIHRoZSBNYXRlcmlhbCBEZXNpZ24gaWNvbiB0byB1c2UuXG4gICAqL1xuICBnZXRGaWxlSWNvbihjb250ZW50VHlwZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCFjb250ZW50VHlwZSkgcmV0dXJuIHRoaXMuREVGQVVMVF9NSU1FX1RZUEVfSUNPTjtcblxuICAgIHJldHVybiB0aGlzLk1JTUVfVFlQRV9JQ09OX01BUFtjb250ZW50VHlwZV0gfHwgdGhpcy5ERUZBVUxUX01JTUVfVFlQRV9JQ09OO1xuICB9XG59XG4iLCJAaWYgKHR5cGUgPT09ICdmb2xkZXInKSB7XG4gIDxtYXQtaWNvbiBjbGFzcz1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgZm9udEljb249XCJmb2xkZXJcIiAvPlxufSBAZWxzZSB7XG4gICBcbiAgPG1hdC1pY29uIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiBbZm9udEljb25dPVwiZ2V0RmlsZUljb24oY29udGVudFR5cGUpXCIgLz5cbn1cbiJdfQ==