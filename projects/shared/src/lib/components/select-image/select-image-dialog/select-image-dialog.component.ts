import {
  ChangeDetectionStrategy,
  Component,
  computed, inject,
  signal,
} from '@angular/core';
import {
  FileManagerComponent, StorageFile,
  StorageItem,
} from 'angular-firebase-storage-manager';
import {SelectionModel} from '@angular/cdk/collections';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {StorageService} from '@shared-library/services';

export interface SelectImageDialogContract {
  allowedFileTypes: string[],
}
export interface SelectImageDialogCloseContract {
  file: StorageFile,
  downloadUrl: string,
}

@Component({
  selector: 'anon-shared-select-image-dialog',
  templateUrl: './select-image-dialog.component.html',
  styleUrl: './select-image-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FileManagerComponent, MatDialogTitle,
    MatDialogContent, MatDialogActions, MatButton, MatDialogClose,
  ],
})
export class SelectImageDialogComponent {
  private contract = inject<SelectImageDialogContract>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<SelectImageDialogComponent>);
  private storageService = inject(StorageService);

  selectionModel = signal(
      new SelectionModel<StorageItem>(false),
  );

  selectionModelSignal = toSignal(this.selectionModel().changed);

  selectedFile = computed(() => {
    const selectedModel = this.selectionModelSignal()?.source;
    const selectedItem = selectedModel?.selected[0];
    const isFile = selectedItem?.type === 'file';
    const isValidFileType = this.contract.allowedFileTypes
        ?.includes((selectedItem as StorageFile)?.contentType || '');
    return isFile && isValidFileType ? selectedItem : null;
  });

  async onSelectImage() {
    const selectedFile = this.selectedFile();
    if (!selectedFile) return;

    const fileRef = this.storageService.itemRef(selectedFile.fullPath);
    const downloadUrl = await this.storageService.getURL(fileRef);
    const contract: SelectImageDialogCloseContract = {
      downloadUrl,
      file: selectedFile,
    };
    this.dialogRef.close(contract);
  }
}
