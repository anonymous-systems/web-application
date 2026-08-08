import { MetadataRoute } from 'next'
import { CompanyInformation } from '@workspace/ui/lib/company-information'

/**
 * Crawl the public site; keep the personal and auth routes out of the index.
 *
 * These are disallowed because they are meaningless to a crawler rather than
 * secret — `/profile` needs a session, and the sign-in flow indexes as duplicate
 * thin pages that compete with the content for the same queries.
 */
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/profile', '/onboarding', '/sign-in', '/sign-up', '/sign-out'],
  },
  sitemap: `${CompanyInformation.website}/sitemap.xml`,
})

export default robots
