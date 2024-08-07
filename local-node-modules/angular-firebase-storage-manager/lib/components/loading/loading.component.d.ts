import { OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare class LoadingComponent implements OnInit {
    private sanitizer;
    /**
     * Configures the height of the loading SVG (in pixels). Defaults to 250px.
     */
    height: import("@angular/core").InputSignal<number>;
    /**
     * A dynamic SVG string representing the loading animation.
     * This string is generated using the provided height.
     * @private
     */
    LOADING_SVG: (height: number) => string;
    /**
     * Holds a sanitized version of the dynamic SVG, ready for rendering.
     */
    svg?: SafeHtml;
    constructor(sanitizer: DomSanitizer);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoadingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LoadingComponent, "anon-loading", never, { "height": { "alias": "height"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
