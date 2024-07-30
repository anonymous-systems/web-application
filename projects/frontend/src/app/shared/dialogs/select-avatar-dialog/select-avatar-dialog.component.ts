import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {
  MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle,
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'anon-select-avatar-dialog',
  templateUrl: './select-avatar-dialog.component.html',
  styleUrl: './select-avatar-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgOptimizedImage, NgClass, MatButton, MatDialogClose,
    MatDialogTitle, MatDialogContent, MatDialogActions,
  ],
})
export class SelectAvatarDialogComponent {
  readonly title = 'Select avatar';

  readonly avatars = new Array(30)
      .fill(0)
      .map((_, i) => i + 1);

  selectedAvatar = signal<number | null>(null);
}
