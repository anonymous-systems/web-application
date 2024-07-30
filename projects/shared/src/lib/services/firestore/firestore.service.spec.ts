import {TestBed} from '@angular/core/testing';

import {FirestoreService} from './firestore.service';
import {Firestore} from '@angular/fire/firestore';

describe('FirestoreService', () => {
  let service: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Firestore, useValue: {}},
      ],
    });
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
