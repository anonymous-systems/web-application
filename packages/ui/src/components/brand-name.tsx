import { CSSProperties, JSX } from 'react'
import { CompanyInformation } from '@workspace/ui/lib/company-information'

interface Props {
  className?: string
  style?: CSSProperties
}
export const BrandName = (props: Props): JSX.Element => {
  const name = CompanyInformation.name

  return (
    <h2
      className={`text-2xl font-nunito ${props.className}`}
      style={{
        color: 'var(--secondary-color)',
        ...props.style
      }}
    >
      {name}
    </h2>
  )
}