import { JSX } from 'react'
import { WelcomePage } from '@/app/_pages/welcome'

const Page = async (): Promise<JSX.Element> => {
  return <WelcomePage />
}

export default Page