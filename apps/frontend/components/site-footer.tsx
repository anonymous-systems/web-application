import { JSX } from 'react'
import Link from 'next/link'
import { Github, Mail, Phone } from 'lucide-react'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { Divider } from '@workspace/ui/components/divider'
import { AppRoutes } from '@/lib/app-routes'

interface FooterLink {
  name: string
  href: string
  /** Set for destinations outside the app, which need the rel guard. */
  external?: boolean
}

interface FooterColumn {
  heading: string
  links: FooterLink[]
}

const columns: FooterColumn[] = [
  {
    heading: 'Explore',
    links: [
      { name: 'Home', href: AppRoutes.home },
      { name: 'Stories', href: AppRoutes.stories },
      { name: 'Portfolio', href: AppRoutes.portfolio },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { name: 'Privacy Policy', href: AppRoutes.privacyPolicy },
      { name: 'Terms & Conditions', href: AppRoutes.termsAndConditions },
    ],
  },
]

/**
 * The site footer.
 *
 * It exists mainly to carry the legal links. Before it, Privacy Policy and
 * Terms were reachable only from the onboarding consent checkboxes — so a
 * visitor who never signed up could not read either, which is a problem for a
 * public site beyond mere navigation.
 */
export const SiteFooter = (): JSX.Element => (
  // The bottom padding clears the floating command bar, which would otherwise
  // sit over the copyright line at the end of every page.
  <footer
    className="mt-16 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))]"
    data-testid="siteFooter"
  >
    <Divider />

    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pt-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="flex max-w-xs flex-col gap-2">
          <span className="font-semibold">{CompanyInformation.name}</span>
          <p className="text-muted-foreground text-sm">
            {CompanyInformation.byline}
          </p>
        </div>

        {/* Two columns rather than a single list: the legal links are the ones
            that must be findable, and a heading is what makes them scannable. */}
        <div className="flex gap-12">
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="mb-3 text-sm font-semibold">{column.heading}</h2>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <nav aria-label="Contact" className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Contact</h2>
          <a
            href={`mailto:${CompanyInformation.email}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <Mail className="size-4" aria-hidden />
            {CompanyInformation.email}
          </a>
          <a
            href={`tel:${CompanyInformation.business.telephone.replace(/[^\d+]/g, '')}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <Phone className="size-4" aria-hidden />
            {CompanyInformation.business.telephone}
          </a>
          <a
            href={`https://github.com/${CompanyInformation.socials.github}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <Github className="size-4" aria-hidden />
            GitHub
          </a>
        </nav>
      </div>

      <p className="text-muted-foreground text-xs">
        © {new Date().getFullYear()} {CompanyInformation.full_name}. All rights
        reserved.
      </p>
    </div>
  </footer>
)
