import {
  ComponentFixture, fakeAsync, TestBed, tick,
} from '@angular/core/testing';
import {TopAppBarComponent} from './top-app-bar.component';
import {AuthService} from '@shared-library';
import {of} from 'rxjs';
import {provideRouter} from '@angular/router';
import {User} from '@angular/fire/auth';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatMenuItemHarness} from '@angular/material/menu/testing';

describe('TopAppBarComponent', () => {
  let component: TopAppBarComponent;
  let fixture: ComponentFixture<TopAppBarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(
        'AuthService', ['authState$', 'signOut'],
    );

    mockAuthService.authState$.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [TopAppBarComponent],
      providers: [
        provideRouter([]),
        {provide: AuthService, useValue: mockAuthService},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopAppBarComponent);

    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    component = fixture.componentInstance;

    component.homeRoute.set(['/']);

    component.singInRoute.set(['/sign-in']);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('Anonymous Systems');
  });

  xit('should display the user information', fakeAsync(() => {
    // Mock user data
    const mockUser = {
      uid: 'mock-user-id',
      displayName: 'Mock User Name',
    } as User;

    mockAuthService.authState$.and.returnValue(of(mockUser));

    fixture.detectChanges();
    tick(500);

    console.debug('before', component.user());

    fixture.detectChanges();
    tick(500);

    console.debug('after', component.user());

    const userNameElement = fixture.nativeElement
        .querySelector('.user-name') as HTMLElement;

    expect(userNameElement.getAttribute('alt'))
        .toContain(mockUser.displayName + ' profile avatar');
  }));

  xit(
      'should call signOut on the AuthService when signOut is clicked',
      async () => {
        const signOutBtn = await loader.getHarness(
            MatMenuItemHarness.with({text: 'Sign out'}),
        );

        signOutBtn.click();

        expect(mockAuthService.signOut).toHaveBeenCalled();
      },
  );
});
