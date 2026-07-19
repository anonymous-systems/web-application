import { JSX } from 'react'
import { CompanyInformation } from '@workspace/ui/lib/company-information'

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col gap-2" data-testid="dashboardPage">
      <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
        {CompanyInformation.name} Admin
      </p>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="text-muted-foreground">
        Welcome back. Choose a section from the sidebar to manage content.
      </p>
    </div>
  )
}
