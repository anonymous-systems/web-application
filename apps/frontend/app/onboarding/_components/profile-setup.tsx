'use client'

import {
  ChangeEvent,
  FormEvent,
  JSX,
  useRef,
  useState
} from 'react'
import { CircleUserRound, Plus, Upload, User, X } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { AvatarSelectionDialog } from '@/components/avatar-selection-dialog'
import { cn } from '@workspace/ui/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { FormValueValidator } from '@workspace/ui/models/interfaces/form-value-validator'
import { toast } from '@workspace/ui/components/sonner'
import { Label } from '@workspace/ui/components/label'

interface Props {
  onBack?: () => void
  onFinish?: (userProfile: UserProfile) => void
}
export const ProfileSetup = (props: Props): JSX.Element => {
  const [form, setForm] = useState<UserProfile>({
    avatar: null,
    firstName: '',
    lastName: '',
    username: ''
  })
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const [submitted, setSubmitted] = useState(false)

  const validators: Record<keyof UserProfile, FormValueValidator> = {
    avatar: { required: false, isValid: true },
    firstName: { required: true, isValid: form.firstName !== '' && /^[a-zA-Z]+$/.test(form.firstName) },
    lastName: { required: true, isValid: form.lastName !== '' && /^[a-zA-Z]+$/.test(form.lastName) },
    username: { required: true, isValid: form.username !== '' && /^[a-z0-9-]+$/.test(form.username) }
  }
  const formValid = Object.values(validators).every(validator => validator.isValid)

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file == null) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const base64Image = e.target?.result ?? reader.result?.toString()
      if (base64Image != null && typeof base64Image === 'string') {
        updateForm('avatar', base64Image)
      }
    }
  }

  const updateForm = <K extends keyof UserProfile>(key: K, value: UserProfile[K]): void => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleFieldUpdate = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    updateForm(name as keyof UserProfile, value)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setSubmitted(true)
    if (!formValid) {
      toast.error('Please fill in all required fields correctly.')
      return
    }
    props.onFinish?.(form)
  }

  return (
    <>
      <h3 className='text-3xl'>Fill in your profile</h3>

      <p className='text-muted-foreground'>
        To complete your onboarding, please fill in your profile information.
        This will help us tailor the experience to your needs and preferences.
      </p>

      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <picture
          className={cn(
            'grid place-content-center relative border-4',
            'rounded-full size-25 self-center',
            'bg-center bg-contain bg-no-repeat transition-all'
          )}
          style={{
            backgroundImage: form.avatar != null
              ? `url(${form.avatar})`
              : undefined
          }}
        >
          <AnimatePresence>
            {form.avatar == null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <CircleUserRound
                  className='w-[65px] h-[65px] text-muted-foreground'
                  strokeWidth={1}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' className='absolute bottom-[-5px] right-[-5px] p-2 size-8'>
                <Plus className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => { setShowAvatarDialog(true) }}>
                <User className='size-5' />
                {form.avatar == null ? 'Select' : 'Change'} avatar
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => { hiddenInputRef.current?.click() }}>
                <Upload className='size-5' />
                Upload avatar
              </DropdownMenuItem>

              {form.avatar != null && (
                <DropdownMenuItem onSelect={()=> { updateForm('avatar', null) }}>
                  <X className='size-5' />
                  Clear avatar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
            <Input
              hidden
              type='file'
              name='avatar'
              ref={hiddenInputRef}
              accept='image/*'
              onChange={handleAvatarUpload}
            />
          </DropdownMenu>
        </picture>

        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-4'>
            <Input
              type='text'
              placeholder='First Name'
              name='firstName'
              autoComplete='given-name'
              value={form.firstName}
              aria-invalid={submitted && !validators.firstName.isValid}
              onChange={handleFieldUpdate}
            />
            <Input
              type='text'
              placeholder='Last Name'
              name='lastName'
              autoComplete='family-name'
              value={form.lastName}
              aria-invalid={submitted && !validators.lastName.isValid}
              onChange={handleFieldUpdate}
            />
          </div>
          {submitted && (!validators.firstName.isValid || !validators.lastName.isValid) && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <Label className='px-2 text-destructive-foreground text-xs'>
                  Name fields must only contain letters and cannot be empty.
                </Label>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Input
            id='username'
            type='text'
            placeholder='Username'
            name='username'
            autoComplete='username'
            value={form.username}
            aria-invalid={submitted && !validators.username.isValid}
            onChange={({target}) => { updateForm('username', target.value.trim().toLowerCase()) }}
          />
          <AnimatePresence>
            {submitted && !validators.username.isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <Label htmlFor='username' className='px-2 text-destructive-foreground text-xs'>
                  Username must be lowercase and can only contain letters, numbers, and hyphens.
                </Label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='flex items-center gap-2'>
          <Button className='basis-1/2' variant='outline' onClick={props.onBack}>Back</Button>
          <Button className='basis-1/2' type='submit'>Finish</Button>
        </div>
      </form>

      {showAvatarDialog && (
        <AvatarSelectionDialog
          open={true}
          selectedAvatar={form.avatar}
          onSelectAvatar={(avatar) => { updateForm('avatar', avatar) }}
          onClose={() => { setShowAvatarDialog(false) }}
        />
      )}
    </>
  )
}