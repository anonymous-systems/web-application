import {ComponentFixture, TestBed} from '@angular/core/testing';

import {provideRouter} from '@angular/router';
import {
  BottomNavigationMenuComponent,
} from './bottom-navigation-menu.component';
import {mockRoutes} from '@shared-library/mocks';

describe('BottomNavigationMenuComponent', () => {
  let component: BottomNavigationMenuComponent;
  let fixture: ComponentFixture<BottomNavigationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavigationMenuComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNavigationMenuComponent);

    component = fixture.componentInstance;

    component.segments.set([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set bottomNavMenuRoutes correctly', () => {
    component.segments.set(mockRoutes);

    fixture.detectChanges();

    expect(component.segments()).toEqual(mockRoutes);
  });

  it('should handle empty bottomNavMenuRoutes', () => {
    component.segments.set([]);

    fixture.detectChanges();

    expect(component.segments()).toEqual([]);
  });

  it('should handle null bottomNavMenuRoutes', () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    component.segments.set(null as any);

    fixture.detectChanges();

    expect(component.segments()).toBeNull();
  });

  it('should handle undefined bottomNavMenuRoutes', () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    component.segments.set(undefined as any);

    fixture.detectChanges();

    expect(component.segments()).toBeUndefined();
  });
});
