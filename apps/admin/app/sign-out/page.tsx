import { JSX } from 'react'
import { AdminSignOutCard } from '@/components/admin-sign-out-card'

export default function SignOutPage(): JSX.Element {
  return (
    <main
      data-testid='signOutPage'
      className='grid place-items-center min-h-svh bg-background p-8'
    >
      <AdminSignOutCard />
    </main>
  )
}
