import { JSX } from 'react'
import Link from 'next/link'
import {
  BookText,
  Cpu,
  FolderGit2,
  FolderTree,
  MessageSquare,
  Tags,
  type LucideIcon,
} from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { getOverviewCounts } from '@/services/overview-service'
import { DashboardRoutes } from '@/lib/app-routes'

interface Stat {
  label: string
  value: number
  href: string
  icon: LucideIcon
}

export default async function Page(): Promise<JSX.Element> {
  const counts = await getOverviewCounts()

  const stats: Stat[] = [
    { label: 'Stories', value: counts.stories, href: DashboardRoutes.stories, icon: BookText },
    { label: 'Projects', value: counts.projects, href: DashboardRoutes.projects, icon: FolderGit2 },
    { label: 'Comments', value: counts.comments, href: DashboardRoutes.comments, icon: MessageSquare },
    { label: 'Categories', value: counts.categories, href: DashboardRoutes.categories, icon: FolderTree },
    { label: 'Tags', value: counts.tags, href: DashboardRoutes.tags, icon: Tags },
    { label: 'Technologies', value: counts.technologies, href: DashboardRoutes.technologies, icon: Cpu },
  ]

  return (
    <div className="flex flex-col gap-6" data-testid="dashboardPage">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          {CompanyInformation.name} Admin
        </p>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back. A quick snapshot of your content.
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-3"
        data-testid="overviewStats"
      >
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            data-testid="overviewStatCard"
            data-stat={stat.label.toLowerCase()}
          >
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <stat.icon className="size-4" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
