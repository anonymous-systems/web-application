import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BottomNavigationMenuComponent, GenericItem} from '@shared-library';
import {provideRouter} from '@angular/router';

const mockRoutes: GenericItem[] = [
  {id: '1', name: 'Home'},
  {id: '2', name: 'Profile'},
  {id: '3', name: 'Settings'},
];

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

    component.bottomNavMenuRoutes.set([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set bottomNavMenuRoutes correctly', () => {
    component.bottomNavMenuRoutes.set(mockRoutes);

    fixture.detectChanges();

    expect(component.bottomNavMenuRoutes()).toEqual(mockRoutes);
  });

  it('should handle empty bottomNavMenuRoutes', () => {
    component.bottomNavMenuRoutes.set([]);

    fixture.detectChanges();

    expect(component.bottomNavMenuRoutes()).toEqual([]);
  });

  it('should handle null bottomNavMenuRoutes', () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    component.bottomNavMenuRoutes.set(null as any);

    fixture.detectChanges();

    expect(component.bottomNavMenuRoutes()).toBeNull();
  });

  it('should handle undefined bottomNavMenuRoutes', () => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    component.bottomNavMenuRoutes.set(undefined as any);

    fixture.detectChanges();

    expect(component.bottomNavMenuRoutes()).toBeUndefined();
  });
});
