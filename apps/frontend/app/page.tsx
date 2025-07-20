import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { ThemeToggle } from '@workspace/ui/components/theme-toggle'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { Button } from '@workspace/ui/components/button'

export default function HomePage() {
  const { name } = CompanyInformation

  return (
    <div className="grid place-content-center min-h-svh">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="huge">{name}</h1>
        <h2 className='h2 text-muted-foreground'>Frontend Coming soon...</h2>
        <ThemeToggle />
        <h3 className='h3'>Test Routes below:</h3>
        {Object.entries(AppRoutes).map(([k,v]) => (
          <Link key={k} href={v}>
          <Button>{k}</Button>
        </Link>
        ))}
      </div>
    </div>
  )
}
