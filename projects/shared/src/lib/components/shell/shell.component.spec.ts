import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellComponent} from './shell.component';
import {
  AuthService,
} from '@shared-library';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Observable, of} from 'rxjs';
import {provideRouter} from '@angular/router';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(AuthService, ['authState$']);
    mockBreakpointObserver = jasmine.createSpyObj(
        BreakpointObserver,
        ['observe'],
    );

    mockAuthService.authState$.and.returnValue(of(null));

    mockBreakpointObserver.observe.and.returnValue(
      of({matches: true}) as Observable<BreakpointState>,
    );

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {provide: AuthService, useValue: mockAuthService},
        {provide: BreakpointObserver, useValue: mockBreakpointObserver},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);

    component = fixture.componentInstance;

    component.homeRoute.set('/');

    component.signInRoute.set('/sign-in');

    component.segments.set([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
