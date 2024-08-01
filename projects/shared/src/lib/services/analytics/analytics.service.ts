import {inject, Injectable} from '@angular/core';
import {
  AnalyticsCallOptions, EventParams, getAnalytics, Item, logEvent,
} from '@angular/fire/analytics';
import {LoggerService} from '../logger/logger.service';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private analytics = inject(getAnalytics);
  private logger = inject(LoggerService);

  /**
   * Logs a "login" event to Google Analytics 4.
   *
   * @param {Object} [eventParams] - Optional parameters specific to the
   * "login" event (e.g., method).
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#login | GA4 Reference Link}
   * @see logEvent
   */
  logSignIn(
      eventParams?: {method?: string},
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'login', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging sign in event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "search" event to Google Analytics 4.
   *
   * @param {Object} eventParams - Parameters for the "search" event, including:
   *   - `search_terms`: The search terms used.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#search | GA4 Reference Link}
   */
  logSearch(
      eventParams: {search_terms: string}, options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'search', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging search event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "share" event to Google Analytics 4.
   *
   * @param {Object} eventParams - Parameters for the "share" event, including:
   *   - `method`: The method used to share (e.g., "email", "social").
   *   - `content_type`: The type of content shared (e.g., "article", "video").
   *   - `item_id`: The ID of the shared item.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#share | GA4 Reference Link}
   */
  logShare(
      eventParams: {
        method: string, content_type: string, item_id: string,
      },
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'share', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging share event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "sign_up" event to Google Analytics 4.
   *
   * @param {Object} [eventParams] - Optional parameters specific to the
   * "sign_up" event (e.g., method).
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#sign_up | GA4 Reference Link}
   */
  logSignUp(
      eventParams?: {method?: string},
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'sign_up', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging sign up event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "select_content" event to Google Analytics 4.
   *
   * @param {Object} eventParams - Parameters for the "select_content"
   * event, including:
   *   - `content_type`: The type of content selected
   *      (e.g., "product", "article").
   *   - `content_id`: The ID of the selected content.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#select_content | GA4 Reference Link}
   */
  logSelectContent(
      eventParams: {content_type: string, content_id: string},
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'select_content', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging select content event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "select_item" event to Google Analytics 4.
   *
   * @param {Object} eventParams - Parameters for the "select_item"
   * event, including:
   *   - `item_list_id`: (Optional) The ID of the list in which the item
   *      was presented.
   *   - `item_list_name`: (Optional) The name of the list in which the item
   *      was presented.
   *   - `items`: An array of `Item` objects representing the selected items.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   *  the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#select_item | GA4 Reference Link}
   */
  logSelectItem(
      eventParams: {
        item_list_id?: string,
        item_list_name?: string,
        items: Item[],
      },
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'select_item', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging select item event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "view_item_list" event to Google Analytics 4.
   *
   * @param {Object} eventParams - Parameters for the "view_item_list"
   * event, including:
   *   - `item_list_id`: (Optional) The ID of the list in which the item
   *      was presented.
   *   - `item_list_name`: (Optional) The name of the list in which the item
   *      was presented.
   *   - `items`: An array of `Item` objects representing the viewed items.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_item_list | GA4 Reference Link}
   */
  logViewItemList(
      eventParams: {
        item_list_id?: string,
        item_list_name?: string,
        items: Item[],
      },
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'view_item_list', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging view item list event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs a "view_item" event to Google Analytics 4.
   *
   * @param {Object} eventParams - Parameters for the "view_item"
   * event, including:
   *   - `currency`: The currency in which the value is expressed (e.g., "USD").
   *   - `value`: The monetary value associated with the view.
   *   - `items`: An array of `Item` objects representing the viewed items.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_item | GA4 Reference Link}
   */
  logViewItem(
      eventParams: {
        currency: string,
        value: number,
        items: Item[],
      },
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'view_item', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging view item event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /** Log tutorial begin event
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#tutorial_begin | GA4 Reference Link}
   */
  /**
   * Logs a "tutorial_begin" event to Google Analytics 4.
   *
   * @param {EventParams} [eventParams] - Optional parameters for the event.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#tutorial_begin | GA4 Reference Link}
   */
  logTutorialBegin(
      eventParams?: EventParams,
      options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'tutorial_begin', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging tutorial begin event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /** Log tutorial complete event
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#tutorial_complete | GA4 Reference Link}
   */
  /**
   * Logs a "tutorial_complete" event to Google Analytics 4.
   *
   * @param {EventParams} [eventParams] - Optional parameters for the event.
   *
   * @param {AnalyticsCallOptions} [options] - Optional configuration for
   * the analytics call.
   *
   * @throws {Error} If there is an error logging the event.
   *
   * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#tutorial_complete | GA4 Reference Link}
   */
  logTutorialComplete(
      eventParams?: EventParams, options?: AnalyticsCallOptions,
  ): void | Error {
    try {
      logEvent(this.analytics, 'tutorial_complete', eventParams, options);
    } catch (error: unknown) {
      this.logger.error(
          'Error logging tutorial complete event to Google Analytics 4.', error,
      );

      throw error;
    }
  }

  /**
   * Logs an "exception" event to Google Analytics 4.
   *
   * @param {string} description - A description of the exception.
   *
   * @param {boolean = true} fatal - (Optional) Indicates whether the exception
   * was fatal (defaults to true).
   *
   * @throws {Error} If there is an error logging the event.
   */
  logExecption(description: string, fatal = true): void | Error {
    try {
      // Limit descriptions to maximum of 150 characters.
      // See: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#exd.
      description = description.substring(0, 150);

      logEvent(this.analytics, 'exception', {description: description, fatal});
    } catch (error: unknown) {
      this.logger.error(
          'Error logging exception event to Google Analytics 4.', error,
      );

      throw error;
    }
  }
}
