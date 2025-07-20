import { JSX } from 'react'
import { SignUpCard } from '@/app/sign-up/_components/SignUpCard'

const SignUpPage = async (): Promise<JSX.Element> => {
  return (
    <main className='grid place-items-center h-screen bg-background p-8 pb-22'>
      <SignUpCard />
    </main>
  )
}

export default SignUpPage