import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { FirestoreService } from "../../../../../../shared/src/lib/services";

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FirestoreService, useValue: {} },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
