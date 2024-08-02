import {
  ApplicationConfig, ErrorHandler, provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideFirebase} from './firebase-modules';
import {
  provideAnimationsAsync,
} from '@angular/platform-browser/animations/async';
import {AnalyticsErrorHandler} from '@shared-library/error-handling';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: ErrorHandler, useClass: AnalyticsErrorHandler},
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideFirebase(),
  ],
};
