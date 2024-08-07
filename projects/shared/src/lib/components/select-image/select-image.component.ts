import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, effect,
  inject, input,
  model,
  signal,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatError} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  SelectImageDialogCloseContract,
  SelectImageDialogComponent, SelectImageDialogContract,
} from './select-image-dialog/select-image-dialog.component';
import {first} from 'rxjs';
import {SafePipe} from '@shared-library/pipes';

@Component({
  selector: 'anon-shared-select-image',
  templateUrl: './select-image.component.html',
  styleUrl: './select-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon, SafePipe, MatError, MatButton, NgOptimizedImage],
})
export class SelectImageComponent {
  private dialog = inject(MatDialog);
  private cdRef = inject(ChangeDetectorRef);

  imageFormControl = input(new FormControl<string | null>(null));

  loading = model(false);

  allowedFileTypes = model([
    'image/webp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
  ]);

  imageError = signal<ErrorEvent | null>(null);

  imageChangeSignal = toSignal(this.imageFormControl().valueChanges);

  imageEffect = effect(() => {
    // eslint-disable-next-line max-len
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars */
    const image = this.imageChangeSignal();
    this.imageError.set(null);
  }, {allowSignalWrites: true});

  get image() {
    return this.imageFormControl().value;
  }

  openFileManagerDialog() {
    this.loading.set(true);
    const contract: SelectImageDialogContract = {
      allowedFileTypes: this.allowedFileTypes(),
    };
    const dialogRef = this.dialog.open(
        SelectImageDialogComponent,
        {
          id: 'select-image-dialog',
          data: contract,
        },
    );

    dialogRef.afterClosed().pipe(first())
        .forEach((contract: SelectImageDialogCloseContract) => {
          if (contract && contract.downloadUrl) {
            this.imageFormControl().setValue(contract.downloadUrl);
            this.cdRef.markForCheck();
          }
          this.loading.set(false);
        });
  }

  resetImage() {
    this.imageFormControl().reset(null);
  }
}
