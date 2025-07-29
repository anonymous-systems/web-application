'use client'

import { JSX, useState } from 'react'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Label } from '@workspace/ui/components/label'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { Button } from '@workspace/ui/components/button'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { toast } from '@workspace/ui/components/sonner'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  onContinue?: () => void
  onBack?: () => void
}
export const Agreements = (props: Props): JSX.Element => {
  const { name, domain } = CompanyInformation
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [highlightTerms, setHighlightTerms] = useState(false)
  const [highlightPrivacy, setHighlightPrivacy] = useState(false)

  const handleContinue = (): void => {
    const termsMissing = !acceptedTerms
    const privacyMissing = !acceptedPrivacy

    setHighlightTerms(termsMissing)
    setHighlightPrivacy(privacyMissing)

    if (termsMissing || privacyMissing) {
      toast.warning('Please accept the terms and conditions and privacy policy to continue.')
      return
    }
    props.onContinue?.()
  }

  const handleTermsChange = (): void => {
    setAcceptedTerms(!acceptedTerms)
    if (!highlightTerms) return
    setHighlightTerms(false)
  }

  const handlePrivacyChange = (): void => {
    setAcceptedPrivacy(!acceptedPrivacy)
    if (!highlightPrivacy) return
    setHighlightPrivacy(false)
  }

  const highlightedClass = 'border-2 border-destructive ring-2 ring-destructive'

  return (
    <>
      <h3 className='text-3xl'>Terms and Conditions</h3>

      <p className='text-muted-foreground'>
        These terms and conditions outline the rules and regulations for the use
        of {name}’s website, located at {domain}.
      </p>

      <p className='text-muted-foreground'>
        By accessing this website we assume you accept these terms and conditions.
        Do not continue to use {name}'s website if you do not agree with all of
        the terms and conditions stated on this page.
      </p>

      <div className='flex items-center gap-4'>
        <Checkbox
          id='terms-conditions'
          checked={acceptedTerms}
          onCheckedChange={handleTermsChange}
          className={cn({ highlightedClass: highlightTerms }, 'transition-colors')}
          aria-invalid={highlightTerms}
          aria-describedby={highlightTerms ? 'terms-and-conditions-error' : undefined}
        />
        <Label htmlFor='terms-conditions'>
          I agree to the
          <Link href={AppRoutes.termsAndConditions} target='_blank'>
            <Button variant='link' className='p-0'>
              terms and conditions
            </Button>
          </Link>
        </Label>
      </div>
      <AnimatePresence>
        {highlightTerms && (
          <motion.div
            id='terms-and-conditions-error'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='text-destructive-foreground text-sm overflow-hidden'
            aria-live='polite'
          >
            You must accept the terms and conditions.
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex items-center gap-4'>
        <Checkbox
          id='privacy-policy'
          checked={acceptedPrivacy}
          onCheckedChange={handlePrivacyChange}
          className={cn({ highlightPrivacy: highlightedClass }, 'transition-colors')}
          aria-invalid={highlightPrivacy}
          aria-describedby={highlightPrivacy ? 'privacy-policy-error' : undefined}
        />
        <Label htmlFor='privacy-policy'>
          I agree to the
          <Link href={AppRoutes.privacyPolicy} target='_blank'>
            <Button variant='link' className='p-0'>
              privacy policy
            </Button>
          </Link>
        </Label>
      </div>
      <AnimatePresence>
        {highlightPrivacy && (
          <motion.div
            id='privacy-policy-error'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='text-destructive-foreground text-sm overflow-hidden'
            aria-live='polite'
          >
            You must accept the privacy policy.
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex items-center gap-2'>
        <Button className='basis-1/2' variant='outline' onClick={props.onBack}>Back</Button>
        <Button className='basis-1/2' onClick={handleContinue}>Continue</Button>
      </div>
    </>
  )
}