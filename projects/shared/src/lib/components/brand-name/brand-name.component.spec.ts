import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandNameComponent } from './brand-name.component';

describe('BrandNameComponent', () => {
  let component: BrandNameComponent;
  let fixture: ComponentFixture<BrandNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrandNameComponent]
    });
    fixture = TestBed.createComponent(BrandNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
