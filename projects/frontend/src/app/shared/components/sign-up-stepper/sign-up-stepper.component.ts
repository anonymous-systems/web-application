import {
  ChangeDetectionStrategy, SimpleChanges,
  OnChanges, OnDestroy, Component,
  computed, inject, output, effect, model,
} from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {SIGNUP_STEP} from '../../enums/signup-step';
import {appRoutes} from '../../../app.routes';
import {Subscription} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {BrandNameComponent} from '@shared-library/components';
import {LoggerService} from '@shared-library/services';

@Component({
  selector: 'anon-sign-up-stepper',
  templateUrl: './sign-up-stepper.component.html',
  styleUrl: './sign-up-stepper.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: CdkStepper, useExisting: SignUpStepperComponent},
  ],
  imports: [
    NgTemplateOutlet,
    CdkStepperModule,
    MatButtonModule,
    RouterLink,
    BrandNameComponent,
    NgClass,
  ],
})
/* eslint-disable-next-line max-len */
export class SignUpStepperComponent extends CdkStepper implements OnChanges, OnDestroy {
  private logger = inject(LoggerService);

  protected readonly appRoutes = appRoutes;

  protected readonly SIGNUP_STEP = SIGNUP_STEP;

  loading = model(false);

  readonly agreementsCompleted = output();

  readonly profileCompleted = output();

  subscriptions = new Subscription();

  stepIndexChange = toSignal(this.selectedIndexChange);

  stepFormControl = computed(() => {
    const stepIndex = this.stepIndexChange();

    const step = this.steps.toArray()[stepIndex || 0];

    return step ? step.stepControl : null;
  });

  stepChangeEffect = effect(() => {
    const control = this.stepFormControl();

    if (control) {
      this.subscriptions.add(
          control.valueChanges.subscribe(() => this._stateChanged()),
      );
    }

    this._stateChanged();
  });

  ngOnChanges(changes: SimpleChanges) {
    const selectedIndexChange = changes['selectedIndex'];

    if (selectedIndexChange && !selectedIndexChange.isFirstChange()) {
      this.linear = false;

      this.selectedIndex = selectedIndexChange.currentValue;

      this.linear = true;

      this._stateChanged();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.unsubscribe();
  }

  nextStep() {
    this.loading.set(true);

    try {
      if (this.selected?.stepControl.invalid) return;

      switch (this.selectedIndex) {
        case SIGNUP_STEP.AGREEMENTS:
          this.agreementsCompleted.emit();
          break;
        case SIGNUP_STEP.PROFILE:
          this.profileCompleted.emit();
          break;
        default:
          this.next();
          break;
      }
    } catch (error) {
      this.logger.error(
          `Something went wrong trying to proceed to next sign up step`,
          error,
      );
    } finally {
      this.loading.set(false);
    }
  }
}
