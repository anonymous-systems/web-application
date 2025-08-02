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
import { getAvatars } from '@/services/avatar-service'
import { toast } from '@workspace/ui/components/sonner'
import { LoadingSpinner } from '@workspace/ui/components/loading-spinner'
import { AnimatePresence, motion, Variants } from 'motion/react'

interface Props {
  open: boolean
  selectedAvatar?: string | null
  onSelectAvatar: (avatar: string) => void
  onClose?: () => void
}
export const AvatarSelectionDialog = (props: Props): JSX.Element => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [avatars, setAvatars] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAvatars = async (): Promise<void> => {
      setIsLoading(true)
      const avatars = await getAvatars()

      if (avatars == null) {
        toast.error('Something went wrong while fetching avatars. Please try again later.')
      }

      setAvatars(avatars == null ? [] : avatars)

      if (props.selectedAvatar && avatars?.includes(props.selectedAvatar)) {
        setSelectedAvatar(props.selectedAvatar)
      }
      setIsLoading(false)
    }

    void fetchAvatars()
  }, [])

  const avatarListVariants: Variants = {
    visible: {
      transition: { staggerChildren: 0.07 }
    },
    hidden: {}
  }

  const avatarItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <Dialog open={props.open}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent onCloseButton={props.onClose}>
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
              {isLoading
                ? <LoadingSpinner className='justify-self-center' />
                : (
                  <motion.div
                    className={[
                      'flex flex-wrap justify-center gap-4',
                      'py-4 px-0 max-h-[40vh] overflow-y-auto'
                    ].join(' ')}
                    variants={avatarListVariants}
                    initial='hidden'
                    animate='visible'
                  >
                    <AnimatePresence>
                      {avatars.map((avatar, index) => (
                        <motion.picture
                          key={index}
                          className={[
                            'rounded-full',
                            selectedAvatar === avatar
                              ? 'outline-4 outline-primary/60 transition-transform scale-110'
                              : 'cursor-pointer'
                          ].join(' ')}
                          onClick={() => { setSelectedAvatar(avatar) }}
                          variants={avatarItemVariants}
                          initial='hidden'
                          animate='visible'
                          exit='hidden'
                        >
                          <Image
                            src={avatar}
                            alt={`Avatar ${index}`}
                            width={100}
                            height={100}
                          />
                        </motion.picture>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

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