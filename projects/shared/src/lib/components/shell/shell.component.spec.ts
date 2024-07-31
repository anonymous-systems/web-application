import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellComponent} from './shell.component';
import {
  AuthService, mockAuthService, mockBreakpointObserver,
} from '@shared-library';
import {BreakpointObserver} from '@angular/cdk/layout';
import {of} from 'rxjs';
import {provideRouter} from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    mockAuthService.authState$.and.returnValue(of(null));

    mockBreakpointObserver.observe.and.returnValue(of({matches: true}));


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
