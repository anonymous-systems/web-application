import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  output
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { CdkStep, CdkStepper, CdkStepperModule } from "@angular/cdk/stepper";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { SIGNUP_STEP } from "../../enums/signup-step";
import { LoggerService } from "../../../../../../shared/src/lib/services";
import { appRoutes } from "../../../app.routes";
import { BrandNameComponent } from "@shared-library";

@Component({
  selector: 'anon-sign-up-stepper',
  templateUrl: './sign-up-stepper.component.html',
  styleUrl: './sign-up-stepper.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: CdkStepper, useExisting: SignUpStepperComponent },
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
export class SignUpStepperComponent extends CdkStepper {
  private logger = inject(LoggerService);

  protected readonly appRoutes = appRoutes;

  loading = model(false);

  readonly agreementsCompleted = output();

  readonly profileCompleted = output();

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }

  identitySteps(index: number, step: CdkStep) {
    return step.label;
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
    } finally { this.loading.set(false); }
  }
}
