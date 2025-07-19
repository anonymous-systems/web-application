import { JSX } from 'react'
import { SignInCard } from '@/app/sign-in/_components/SignInCard'

const SignInPage = async (): Promise<JSX.Element> => {
  return (
    <main className='grid place-items-center h-screen bg-background p-8 pb-22'>
      <SignInCard />
    </main>
  )
}

export default SignInPage