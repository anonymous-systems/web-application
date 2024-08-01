import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignInComponent} from './sign-in.component';
import {AuthService, LoggerService} from '@shared-library/services';
import {appRoutes} from '../../app.routes';
import {provideRouter} from '@angular/router';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(
        'AuthService',
        ['signInWithEmailAndPassword', 'signInWithGoogle'],
    );

    mockLoggerService = jasmine.createSpyObj('LoggerService', ['error']);

    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {provide: AuthService, useValue: mockAuthService},
        {provide: LoggerService, useValue: mockLoggerService},
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

  describe('googleSignIn', () => {
    it('should call signInWithGoogle', () => {
      mockAuthService.signInWithGoogle.and.returnValue(Promise.resolve());

      component.googleSignIn();

      expect(mockAuthService.signInWithGoogle)
          .toHaveBeenCalledWith([appRoutes.home]);
    });
  });
});
