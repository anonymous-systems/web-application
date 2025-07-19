import { JSX } from 'react'
import { WelcomeCard } from '@/app/welcome/_components/WelcomeCard'

const WelcomePage = async (): Promise<JSX.Element> => {
  return (
    <main className='grid place-items-center h-screen bg-background p-8 pb-22'>
      <WelcomeCard />
    </main>
  )
}

export default WelcomePage