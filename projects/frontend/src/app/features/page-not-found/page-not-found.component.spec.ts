import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PageNotFoundComponent} from './page-not-found.component';
import {provideRouter} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('PageNotFoundComponent', () => {
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let component: PageNotFoundComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should display the correct header text', () => {
    const headerElement = fixture.debugElement.query(
        By.css('.header'),
    ).nativeElement;

    expect(headerElement.textContent).toContain('Page Not Found');
  });

  it('should display the correct paragraph text', () => {
    const paragraphElement = fixture.debugElement.query(
        By.css('.header-text'),
    ).nativeElement;

    expect(paragraphElement.textContent)
        .toContain('The page you were looking for does not exist.');
  });

  it('should have a button that navigates to the home route', () => {
    const buttonElement = fixture.debugElement.query(
        By.css('a[mat-stroked-button]'),
    ).nativeElement;

    expect(buttonElement.getAttribute('ng-reflect-router-link')).toBe('/');
  });
});
