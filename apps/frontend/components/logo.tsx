import { JSX } from 'react'
import Image from 'next/image'
import { CompanyInformation } from '@workspace/ui/lib/company-information'

interface Props {
  alt?: string
  size?: number
  className?: string
}
export const Logo = (props: Props): JSX.Element => {
  const name = CompanyInformation.name
  const logoPath = '/logo.svg'

  return (
    <Image
      src={logoPath}
      alt={props.alt ?? `${name} Logo`}
      width={props.size ?? 150}
      height={props.size ?? 150}
      className={props.className}
    />
  )
}