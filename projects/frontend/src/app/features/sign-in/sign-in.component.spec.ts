import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignInComponent} from './sign-in.component';
import {
  AuthService, ErrorService, LoggerService,
} from '@shared-library/services';
import {appRoutes} from '../../app.routes';
import {provideRouter} from '@angular/router';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {UserService} from '../../shared/services/user/user.service';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockUsersService: jasmine.SpyObj<UserService>;
  let mockErrorService: jasmine.SpyObj<ErrorService>;


  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(
        'AuthService',
        ['signInWithEmailAndPassword', 'signInWithGoogle'],
    );

    mockLoggerService = jasmine.createSpyObj('LoggerService', ['error']);

    mockUsersService = jasmine.createSpyObj(
        'UserService',
        ['signInWithGoogle'],
    );

    mockErrorService = jasmine.createSpyObj(
        'ErrorService',
        ['handleAuthenticationError'],
    );


    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {provide: AuthService, useValue: mockAuthService},
        {provide: LoggerService, useValue: mockLoggerService},
        {provide: UserService, useValue: mockUsersService},
        {provide: ErrorService, useValue: mockErrorService},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signIn', () => {
    it(
        'should call signInWithEmailAndPassword with correct credentials',
        () => {
          mockAuthService.signInWithEmailAndPassword
              .and.returnValue(Promise.resolve());

          const mockUserCredentials = {
            email: 'mock-user@email.com',
            password: 'mock-user-password',
          };

          component.signInForm.controls.email
              .setValue(mockUserCredentials.email);

          component.signInForm.controls.password
              .setValue(mockUserCredentials.password);

          component.signIn();

          expect(mockAuthService.signInWithEmailAndPassword)
              .toHaveBeenCalledWith(
                  mockUserCredentials.email,
                  mockUserCredentials.password,
                  [appRoutes.home],
              );
        },
    );
  });

  describe('continueWithGoogle', () => {
    it('should call signInWithGoogle', () => {
      mockUsersService.signInWithGoogle.and.returnValue(Promise.resolve());

      component.continueWithGoogle();

      expect(mockUsersService.signInWithGoogle)
          .toHaveBeenCalledWith([appRoutes.home]);
    });

    it(
        'should handle authentication error if signInWithGoogle fails',
        async () => {
          const mockError = new Error('Google sign-in failed');

          mockUsersService.signInWithGoogle.and.returnValue(
              Promise.reject(mockError),
          );

          try {
            await component.continueWithGoogle();
          } catch (error: unknown) {
            expect(error).toBe(mockError);

            expect(mockErrorService.handleAuthenticationError)
                .toHaveBeenCalledWith(mockError);
          }
        },
    );

    it('should set loading to true and false', async () => {
      mockUsersService.signInWithGoogle.and.callFake(() => {
        return new Promise((resolve) => setTimeout(resolve, 500));
      });

      expect(component.loading()).toBe(false);

      component.continueWithGoogle();

      expect(component.loading()).toBe(true);

      setTimeout(() => {
        expect(component.loading()).toBe(false);
      }, 501);
    });
  });
});
