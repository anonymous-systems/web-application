import {
  ComponentFixture, fakeAsync, TestBed, tick,
} from '@angular/core/testing';
import {TopAppBarComponent} from './top-app-bar.component';
import {AuthService} from '@shared-library/services';
import {of} from 'rxjs';
import {provideRouter} from '@angular/router';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatMenuHarness} from '@angular/material/menu/testing';
import {mockUser} from '@shared-library/mocks';
import {MatButtonHarness} from '@angular/material/button/testing';

describe('TopAppBarComponent', () => {
  let component: TopAppBarComponent;
  let fixture: ComponentFixture<TopAppBarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(
        'AuthService', ['authState$', 'signOut'],
    );

    mockAuthService.authState$.and.returnValue(of(mockUser));

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
      fakeAsync(async () => {
        console.debug('user', component.user()?.uid);

        const profileButton = await loader.getHarness(
            MatButtonHarness.with({variant: 'icon'}),
        );

        profileButton.click();

        fixture.detectChanges();
        tick(500);

        const profileMenu = await loader.getHarness(MatMenuHarness);

        const profileMenuItems = await profileMenu.getItems();

        console.debug('profileMenuItems', profileMenuItems);

        const signOutButton = profileMenuItems[0];

        signOutButton.click();

        expect(mockAuthService.signOut).toHaveBeenCalled();
      }),
  );
});
