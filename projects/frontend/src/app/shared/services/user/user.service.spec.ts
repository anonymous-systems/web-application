import {TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {
  FirestoreService, StorageService, AuthService, LoggerService,
} from '@shared-library/services';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: FirestoreService, useValue: {}},
        {provide: StorageService, useValue: {}},
        {provide: LoggerService, useValue: {}},
        {provide: AuthService, useValue: {}},
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
