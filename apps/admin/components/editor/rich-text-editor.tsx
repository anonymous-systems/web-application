'use client'

import { JSX } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Autoformat,
  BalloonEditor,
  BlockQuote,
  BlockToolbar,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  TableToolbar,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import './rich-text-editor.css'

interface Props {
  /** Initial HTML; the editor is uncontrolled after mount and reports changes via onChange. */
  initialValue: string
  onChange: (html: string) => void
  dataTestId?: string
}

/**
 * Balloon-block CKEditor 5 for rich content, matching the editor style from the
 * previous app: an inline balloon toolbar on selection plus the block toolbar on
 * the left margin. Loaded client-only (next/dynamic ssr:false in the form)
 * because CKEditor needs `window`. Emits HTML, which the `content` field stores.
 */
export const RichTextEditor = ({
  initialValue,
  onChange,
  dataTestId: testId,
}: Props): JSX.Element => {
  // `rich-text-editor` scopes the dark-mode colour fix in rich-text-editor.css.
  return (
    <div
      data-testid={testId}
      className="rich-text-editor [&_.ck-editor__editable]:min-h-60 [&_.ck-editor__editable]:rounded-md [&_.ck-editor__editable]:border [&_.ck-editor__editable]:border-input [&_.ck-editor__editable]:px-3 [&_.ck-editor__editable]:py-2"
    >
      <CKEditor
        editor={BalloonEditor}
        data={initialValue}
        config={{
          licenseKey: 'GPL',
          plugins: [
            Essentials,
            Autoformat,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Link,
            List,
            BlockQuote,
            Code,
            CodeBlock,
            Image,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            MediaEmbed,
            Table,
            TableToolbar,
            BlockToolbar,
          ],
          // Balloon toolbar — appears on text selection.
          toolbar: ['bold', 'italic', 'link', 'code'],
          // Block toolbar — the left-margin button for block-level inserts.
          blockToolbar: [
            'heading',
            '|',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'codeBlock',
            '|',
            'insertTable',
            'mediaEmbed',
          ],
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative',
            ],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onChange={(_event, editor) => onChange(editor.getData())}
      />
    </div>
  )
}
