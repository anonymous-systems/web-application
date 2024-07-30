import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {
  CookiesPopupComponent,
} from './shared/components/cookies-popup/cookies-popup.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, CookiesPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should render router-outlet`, () => {
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('router-outlet')).not.toBeNull();
  });

  it('should render anon-cookies-popup', async () => {
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('anon-cookies-popup')).not.toBeNull();
  });
});
