'use client'

import { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import type { RichTextEditorProps } from '../editor/rich-text-editor'

/**
 * The CKEditor wrapper, loaded client-only because it touches `window`.
 *
 * Declared once and shared: `next/dynamic` splits per call site, so importing
 * the editor separately in each form produced a separate chunk for the same
 * component.
 *
 * The type is stated rather than inferred — `dynamic` cannot name a props type
 * it only sees through an async import, so inference produces an unexportable
 * one.
 */
export const RichTextEditor: ComponentType<RichTextEditorProps> = dynamic(
  () =>
    import('../editor/rich-text-editor').then((module) => module.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="text-muted-foreground text-sm">Loading editor…</div>
    ),
  }
)
