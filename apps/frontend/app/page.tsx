import { ThemeToggle } from '@workspace/ui/components/theme-toggle'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { Button } from '@workspace/ui/components/button'
import { Layout } from '@/components/layout'

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-8 text-center">
        <h2 className='h2 text-muted-foreground'>Frontend Coming soon...</h2>
        <ThemeToggle />
        <h3 className='h3'>Test Routes below:</h3>
        {Object.entries(AppRoutes).map(([k,v]) => (
          <Link key={k} href={v}>
          <Button>{k}</Button>
        </Link>
        ))}
      </div>
    </Layout>
  )
}
