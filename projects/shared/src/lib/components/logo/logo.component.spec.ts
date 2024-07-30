import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoComponent} from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have aria-hidden attribute set to true', () => {
    expect(component.ariaHidden).toBe(true);
  });

  it('should have default width and height set to 250', () => {
    expect(component.width()).toBe(250);

    expect(component.height()).toBe(250);
  });

  it('should have default priority set to false', () => {
    expect(component.priority()).toBe(false);
  });

  it('should allow setting custom width and height', () => {
    component.width.set(300);

    component.height.set(300);

    expect(component.width()).toBe(300);

    expect(component.height()).toBe(300);
  });

  it('should allow setting custom priority', () => {
    component.priority.set(true);

    expect(component.priority()).toBe(true);
  });
});
