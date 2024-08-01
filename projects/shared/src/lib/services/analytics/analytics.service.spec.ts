import {TestBed} from '@angular/core/testing';

import {AnalyticsService} from './analytics.service';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {
  Analytics, getAnalytics,
} from '@angular/fire/analytics';
import {
  environment,
} from '../../../../../frontend/src/environments/environment';

xdescribe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockAnalytics: jasmine.SpyObj<Analytics>;

  beforeEach(() => {
    mockAnalytics = jasmine.createSpyObj('Analytics', ['logEvent']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        {provide: getAnalytics, ueValue: mockAnalytics},
        // provideAnalytics(() => {
        //   const analytics = getAnalytics();

        //   console.debug('mockAnalytics', analytics);

        //   return analytics;
        // }),
      ],
    });

    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // xdescribe('logSignIn', () => {
  //   it('should log a "login" event with optional parameters', () => {
  //     const eventParams = {method: 'email'};

  //     service.logSignIn(eventParams);

  //     expect(logEvent).toHaveBeenCalledWith(
  //         mockAnalytics, 'login', eventParams, undefined,
  //     );
  //   });
  // });
});
