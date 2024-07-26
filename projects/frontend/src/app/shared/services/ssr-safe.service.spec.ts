import { TestBed } from '@angular/core/testing';

import { SSRSafeService } from './ssr-safe.service';
import { PLATFORM_ID } from "@angular/core";

describe('SSRSafeService', () => {
  let service: SSRSafeService;

  describe('when running in a browser environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      });
      service = TestBed.inject(SSRSafeService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should correctly identify browser platform', () => {
      expect(service.isBrowser).toBeTrue();
      expect(service.isServer).toBeFalse();
    });

    it('should detect window object existence', () => {
      expect(service.hasWindow).toBeTrue();
    });
  });

  describe('when running in a server environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      service = TestBed.inject(SSRSafeService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should correctly identify server platform', () => {
      expect(service.isBrowser).toBeFalse();
      expect(service.isServer).toBeTrue();
    });

    xit('should not detect window object existence', () => {
      expect(service.hasWindow).toBeFalse();
    });
  });
});
