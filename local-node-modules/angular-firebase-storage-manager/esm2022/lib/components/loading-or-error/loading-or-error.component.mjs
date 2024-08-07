import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import * as i0 from "@angular/core";
export class LoadingOrErrorComponent {
    constructor() {
        /**
         * An optional Error object to display. If provided, the component will render
         * an error display instead of a loading indicator.
         */
        this.error = input();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: LoadingOrErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.3", type: LoadingOrErrorComponent, isStandalone: true, selector: "anon-loading-or-error", inputs: { error: { classPropertyName: "error", publicName: "error", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "@if (error(); as error) {\n  <div class=\"error\">\n    <h2>Error!</h2>\n    \n    <p>\n      @if (error.message) {\n        {{error.message}}\n      } @else {\n        Something weird happened. Keep calm and try again later.\n      }\n    </p>\n  </div>\n} @else {\n  <anon-loading [height]=\"250\" />\n}\n", styles: ["div.error{color:#b3261e;margin:2rem;padding:2rem;text-align:center;border:1px dashed currentColor;border-radius:2rem}div.error h2{font-size:2rem}div.error p{margin-top:.25rem;font-size:1rem;color:initial}\n"], dependencies: [{ kind: "component", type: LoadingComponent, selector: "anon-loading", inputs: ["height"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.3", ngImport: i0, type: LoadingOrErrorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'anon-loading-or-error', standalone: true, imports: [LoadingComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (error(); as error) {\n  <div class=\"error\">\n    <h2>Error!</h2>\n    \n    <p>\n      @if (error.message) {\n        {{error.message}}\n      } @else {\n        Something weird happened. Keep calm and try again later.\n      }\n    </p>\n  </div>\n} @else {\n  <anon-loading [height]=\"250\" />\n}\n", styles: ["div.error{color:#b3261e;margin:2rem;padding:2rem;text-align:center;border:1px dashed currentColor;border-radius:2rem}div.error h2{font-size:2rem}div.error p{margin-top:.25rem;font-size:1rem;color:initial}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1vci1lcnJvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWZpcmViYXNlLXN0b3JhZ2UtbWFuYWdlci9zcmMvbGliL2NvbXBvbmVudHMvbG9hZGluZy1vci1lcnJvci9sb2FkaW5nLW9yLWVycm9yLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZmlyZWJhc2Utc3RvcmFnZS1tYW5hZ2VyL3NyYy9saWIvY29tcG9uZW50cy9sb2FkaW5nLW9yLWVycm9yL2xvYWRpbmctb3ItZXJyb3IuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sOEJBQThCLENBQUM7O0FBVTlELE1BQU0sT0FBTyx1QkFBdUI7SUFScEM7UUFTRTs7O1dBR0c7UUFDSCxVQUFLLEdBQUcsS0FBSyxFQUFTLENBQUM7S0FDeEI7OEdBTlksdUJBQXVCO2tHQUF2Qix1QkFBdUIscU5DWHBDLHFUQWVBLHdRRFBZLGdCQUFnQjs7MkZBR2YsdUJBQXVCO2tCQVJuQyxTQUFTOytCQUNFLHVCQUF1QixjQUdyQixJQUFJLFdBQ1AsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFDVix1QkFBdUIsQ0FBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBpbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xvYWRpbmdDb21wb25lbnR9IGZyb20gJy4uL2xvYWRpbmcvbG9hZGluZy5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhbm9uLWxvYWRpbmctb3ItZXJyb3InLFxuICB0ZW1wbGF0ZVVybDogJy4vbG9hZGluZy1vci1lcnJvci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9sb2FkaW5nLW9yLWVycm9yLmNvbXBvbmVudC5zY3NzJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0xvYWRpbmdDb21wb25lbnRdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTG9hZGluZ09yRXJyb3JDb21wb25lbnQge1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgRXJyb3Igb2JqZWN0IHRvIGRpc3BsYXkuIElmIHByb3ZpZGVkLCB0aGUgY29tcG9uZW50IHdpbGwgcmVuZGVyXG4gICAqIGFuIGVycm9yIGRpc3BsYXkgaW5zdGVhZCBvZiBhIGxvYWRpbmcgaW5kaWNhdG9yLlxuICAgKi9cbiAgZXJyb3IgPSBpbnB1dDxFcnJvcj4oKTtcbn1cbiIsIkBpZiAoZXJyb3IoKTsgYXMgZXJyb3IpIHtcbiAgPGRpdiBjbGFzcz1cImVycm9yXCI+XG4gICAgPGgyPkVycm9yITwvaDI+XG4gICAgXG4gICAgPHA+XG4gICAgICBAaWYgKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAge3tlcnJvci5tZXNzYWdlfX1cbiAgICAgIH0gQGVsc2Uge1xuICAgICAgICBTb21ldGhpbmcgd2VpcmQgaGFwcGVuZWQuIEtlZXAgY2FsbSBhbmQgdHJ5IGFnYWluIGxhdGVyLlxuICAgICAgfVxuICAgIDwvcD5cbiAgPC9kaXY+XG59IEBlbHNlIHtcbiAgPGFub24tbG9hZGluZyBbaGVpZ2h0XT1cIjI1MFwiIC8+XG59XG4iXX0=