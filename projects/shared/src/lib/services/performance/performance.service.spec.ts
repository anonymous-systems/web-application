import {TestBed} from '@angular/core/testing';

import {PerformanceService} from './performance.service';

import {Performance} from '@angular/fire/performance';

describe('PerformanceService', () => {
  let service: PerformanceService;
  let mockPerformance: jasmine.SpyObj<Performance>;

  beforeEach(() => {
    mockPerformance = jasmine.createSpyObj('Performance', ['trace']);

    TestBed.configureTestingModule({
      providers: [
        {provide: Performance, useValue: mockPerformance},
      ],
    });
    service = TestBed.inject(PerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
