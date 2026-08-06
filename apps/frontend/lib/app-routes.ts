export const AuthRoutes = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  onboarding: '/onboarding',
}
export const PublicRoutes = {
  home: '/',
  welcome: '/welcome',
  stories: '/stories',
  portfolio: '/portfolio',
  termsAndConditions: '/terms-and-conditions',
  privacyPolicy: '/privacy-policy',
  signOut: '/sign-out',
}
export const PrivateRoutes = {
  profile: '/profile',
}
/**
 * Path builders for the dynamic content routes. Deliberately separate from
 * PublicRoutes: the middleware spreads that object's values into a `string[]`
 * of public paths, which a builder function would break. The detail pages need
 * no entry there anyway — everything outside PrivateRoutes is already public.
 */
export const ContentRoutes = {
  storyDetail: (slug: string): string => `${PublicRoutes.stories}/${slug}`,
  portfolioDetail: (slug: string): string => `${PublicRoutes.portfolio}/${slug}`,
}
export const AppRoutes = {
  ...AuthRoutes,
  ...PublicRoutes,
  ...PrivateRoutes,
  ...ContentRoutes,
}
