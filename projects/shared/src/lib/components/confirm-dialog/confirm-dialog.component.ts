import {KeyValuePipe} from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject, OnInit, signal,
} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose,
  MatDialogContent, MatDialogTitle,
} from '@angular/material/dialog';

export interface ConfirmDialogContract {
  title?: string;
  description: string;
  additionalInformation?: string;
  buttonText?: string;
  metadata?: Record<string, string>,
}

@Component({
  selector: 'anon-shared-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    KeyValuePipe, MatButton,
    MatDialogContent, MatDialogActions,
    MatDialogClose, MatDialogTitle,
  ],
})
export class ConfirmDialogComponent implements OnInit {
  contract = inject<ConfirmDialogContract>(MAT_DIALOG_DATA);

  description = signal('This action is irreversible, be careful.');

  buttonText = signal('Confirm');

  ngOnInit() {
    const {description, buttonText} = this.contract;

    if (description) this.description.set(description);

    if (buttonText) this.buttonText.set(buttonText);
  }
}
