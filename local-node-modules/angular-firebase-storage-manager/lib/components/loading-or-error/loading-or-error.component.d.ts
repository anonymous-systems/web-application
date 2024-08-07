import * as i0 from "@angular/core";
export declare class LoadingOrErrorComponent {
    /**
     * An optional Error object to display. If provided, the component will render
     * an error display instead of a loading indicator.
     */
    error: import("@angular/core").InputSignal<Error | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoadingOrErrorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LoadingOrErrorComponent, "anon-loading-or-error", never, { "error": { "alias": "error"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
