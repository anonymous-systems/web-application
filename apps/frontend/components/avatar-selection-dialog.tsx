import { JSX, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter, DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@workspace/ui/components/dialog'
import Image from 'next/image'
import { Button } from '@workspace/ui/components/button'

interface Props {
  open: boolean
  selectedAvatar?: string | null
  onSelectAvatar: (avatar: string) => void
  onClose?: () => void
}
export const AvatarSelectionDialog = (props: Props): JSX.Element => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (props.selectedAvatar != null) {
      setSelectedAvatar(props.selectedAvatar)
    } else {
      setSelectedAvatar(null)
    }
  }, [])

  const avatars = new Array<string>(30).fill('')
    .map((_, i) => `/avatars/${i + 1}.webp`)

  return (
    <Dialog open={props.open}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent>
            <DialogTitle>Select Avatar</DialogTitle>
            <DialogDescription>
              Select an avatar from the available options or upload a new one.
            </DialogDescription>

            <form onSubmit={(e) => {
              e.preventDefault()
              if (selectedAvatar != null) {
                props.onSelectAvatar(selectedAvatar)
                props.onClose?.()
              }
            }}>
              <div
                className={[
                  'flex flex-wrap justify-center gap-4',
                  'py-4 px-0 max-h-[40vh] overflow-y-auto'
                ].join(' ')}
              >
                {avatars.map((avatar, index) => (
                  <picture
                    key={index}
                    className={[
                      'rounded-full',
                      selectedAvatar === avatar
                        ? 'outline-4 outline-primary/60 transition-transform scale-110'
                        : 'cursor-pointer'
                    ].join(' ')}
                    onClick={() => { setSelectedAvatar(avatar) }}
                  >
                    <Image
                      src={avatar}
                      alt={`Avatar ${index}`}
                      width={100}
                      height={100}
                    />
                  </picture>
                ))}
              </div>

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={props.onClose}>
                  Cancel
                </Button>
                <Button type='submit' disabled={selectedAvatar == null}>Use avatar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  )
}