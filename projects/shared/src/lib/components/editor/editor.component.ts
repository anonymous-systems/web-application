import {
  Component, afterNextRender,
  ChangeDetectionStrategy, input, model, output, signal,
} from '@angular/core';
import {ChangeEvent, CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {EditorConfig, Editor} from '@ckeditor/ckeditor5-core';
import {FormsModule} from '@angular/forms';
import type {EditorWatchdog} from 'ckeditor5';

interface CkEditor {
  create(
    sourceElementOrData: HTMLElement | string,
    config?: EditorConfig,
  ): Promise<Editor>;
  EditorWatchdog: typeof EditorWatchdog;
}

@Component({
  selector: 'anon-shared-editor',
  templateUrl: './editor.component.html',
  standalone: true,
  imports: [CKEditorModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  content = model<unknown>();

  config = model.required<EditorConfig>();

  tagName = input('div');

  readonly ready = output<Editor>();

  readonly editorChange = output<ChangeEvent>();

  editor = signal<CkEditor | undefined>(undefined);

  loaded = model(false);

  constructor() {
    afterNextRender(() => {
      import('ckeditor5-custom-balloon-editor/ckeditor.js' as string)
          .then((e) => {
            console.debug('Editor', Object.keys(e.default));

            this.editor.set(e.default.CustomBalloonEditor);

            if (this.editor()) this.loaded.set(true);
          });
    });
  }

  onReady(editor: Editor) {
    this.ready.emit(editor);
  }

  onChange(changeEvent: ChangeEvent) {
    this.editorChange.emit(changeEvent);
  }
}
