import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignUpStepperComponent} from './sign-up-stepper.component';
import {LoggerService} from '../../../../../../shared/src/lib/services';
import {ActivatedRoute} from '@angular/router';

describe('SignUpStepperComponent', () => {
  let component: SignUpStepperComponent;
  let fixture: ComponentFixture<SignUpStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpStepperComponent],
      providers: [
        {provide: LoggerService, useValue: {}},
        {provide: ActivatedRoute, useValue: {}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpStepperComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
