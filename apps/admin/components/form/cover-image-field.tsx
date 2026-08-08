'use client'

import { ChangeEvent, JSX } from 'react'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Button } from '@workspace/ui/components/custom/button'

interface Props {
  id: string
  value: string
  onChange: (url: string) => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
  /** Prefix for the field's test ids, e.g. `story` gives `storyCoverFile`. */
  testIdPrefix: string
}

/**
 * Cover image: a preview, a file picker that uploads, and a URL box for images
 * already hosted elsewhere. Both paths write the same field, so the preview
 * reflects whichever was used last.
 */
export const CoverImageField = ({
  id,
  value,
  onChange,
  onUpload,
  isUploading,
  testIdPrefix,
}: Props): JSX.Element => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>Cover image</Label>

    {value && (
      // eslint-disable-next-line @next/next/no-img-element -- dynamic external cover URL
      <img
        src={value}
        alt="Cover preview"
        className="h-28 w-full max-w-xs rounded-md border object-cover"
        data-testid={`${testIdPrefix}CoverPreview`}
      />
    )}

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={onUpload}
        disabled={isUploading}
        data-testid={`${testIdPrefix}CoverFile`}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          data-testid={`${testIdPrefix}CoverRemove`}
        >
          Remove
        </Button>
      )}
    </div>

    <Input
      type="url"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="…or paste an image URL"
      data-testid={`${testIdPrefix}CoverUrl`}
    />

    {isUploading && <p className="text-muted-foreground text-xs">Uploading…</p>}
  </div>
)
