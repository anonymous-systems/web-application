import {ErrorHandler, inject, Injectable} from '@angular/core';
import {ErrorWithHandledFlag} from '@shared-library/interfaces';
import {AnalyticsService} from '@shared-library/services';
import {formatErrorForAnalytics} from '@shared-library/utils';


@Injectable({providedIn: 'root'})
export class AnalyticsErrorHandler extends ErrorHandler {
  private analyticsService = inject(AnalyticsService);

  override handleError(error: unknown): void {
    const errorHandled = error as ErrorWithHandledFlag;

    if (!errorHandled?.handled) super.handleError(error);

    if (error instanceof Error) {
      this.analyticsService.logExecption(formatErrorForAnalytics(error));
    } else {
      this.analyticsService.logExecption(String(error));
    }
  };
}
