import { JSX } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@workspace/ui/components/button'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { AppRoutes } from '@/lib/app-routes'
import Link from 'next/link'

const WelcomePage = (): JSX.Element => {
  const { name, byline } = CompanyInformation

  const classes = {
    container: 'grid place-items-center h-screen bg-background p-8 pb-22',
    card: 'flex flex-col gap-4 bg-card text-card-foreground rounded-lg outline p-8 max-w-[500px] shadow-sm',
    logoContainer: 'flex justify-center',
    contentContainer: 'flex flex-col gap-4',
    header: 'flex flex-col gap-2 text-center',
    title: 'text-3xl',
    subtitle: 'text-sm text-muted-foreground',
    button: 'rounded-[100px]',
    linkContainer: 'flex justify-center align-items-center gap-1',
    linkText: 'self-center',
  }

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.logoContainer}>
          <Link href={AppRoutes.home}>
            <Logo />
          </Link>
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.header}>
            <div className={classes.title}>Welcome to {name}</div>
            <div className={classes.subtitle}>{byline}</div>
          </div>
          <Button className={classes.button}>Get started</Button>
          <div className={classes.linkContainer}>
            <p className={classes.linkText}>You already have an account?</p>
            <Button variant='link'>Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage