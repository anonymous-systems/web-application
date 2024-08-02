import {ErrorHandler, inject, Injectable} from '@angular/core';
import {AnalyticsService} from '@shared-library/services';
import {formatErrorForAnalytics} from '@shared-library/utils';

@Injectable({providedIn: 'root'})
export class AnalyticsErrorHandler extends ErrorHandler {
  private analyticsService = inject(AnalyticsService);

  override handleError(error: unknown): void {
    super.handleError(error);

    if (error instanceof Error) {
      this.analyticsService.logExecption(formatErrorForAnalytics(error));
    } else {
      this.analyticsService.logExecption(String(error));
    }
  };
}
