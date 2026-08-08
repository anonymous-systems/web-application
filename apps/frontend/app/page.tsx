import { JSX } from 'react'
import { Metadata } from 'next'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { HomePage } from '@/app/_pages/home'

export const metadata: Metadata = {
  // Absolute so the front page is not titled "Anonymous Systems | Anonymous
  // Systems" by the root template.
  title: { absolute: CompanyInformation.title },
  description: CompanyInformation.byline,
}

const Page = (): Promise<JSX.Element> => HomePage()

export default Page
