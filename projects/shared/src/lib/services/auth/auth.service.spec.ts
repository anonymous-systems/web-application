import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from "@angular/fire/auth";
import { LoggerService } from "../logger/logger.service";
import { RouterModule } from "@angular/router";

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        { provide: Auth, useValue: {} },
        { provide: LoggerService, useValue: {} },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
