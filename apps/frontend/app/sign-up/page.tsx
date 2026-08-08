import { JSX } from 'react'
import { AuthCard } from '@/components/auth-card'

const Page = (): JSX.Element => {
  return (
    <main className='grid place-items-center h-screen bg-background p-8 pb-22'>
      <AuthCard mode='sign-up' />
    </main>
  )
}

export default Page
