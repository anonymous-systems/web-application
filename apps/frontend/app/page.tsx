import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { ThemeToggle } from '@workspace/ui/components/theme-toggle'
import { TestAuth } from '@/components/TestAuth'

export default function HomePage() {
  const { name } = CompanyInformation

  return (
    <div className="grid place-content-center min-h-svh">
      <div className="flex flex-col items-center gap-8">
        <h1 className="huge">{name}</h1>
        <h2 className='h2 text-muted-foreground'>Frontend Coming soon...</h2>
        <ThemeToggle />
        <TestAuth />
      </div>
    </div>
  )
}
