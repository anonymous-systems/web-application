import { TestBed } from '@angular/core/testing';
import { ResolveFn, RouterModule } from '@angular/router';

import { incompleteProfileResolver } from './incompleteProfileResolver';
import {
  AuthService,
  LoggerService
} from "../../../../../../shared/src/lib/services";
import { UserService } from "../../services/user/user.service";

describe('incompleteProfileResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => incompleteProfileResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: LoggerService, useValue: {} },
      ],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
