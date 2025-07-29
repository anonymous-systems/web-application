export const AuthRoutes = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  onboarding: '/onboarding',
}
export const PublicRoutes = {
  home: '/',
  welcome: '/welcome',
  termsAndConditions: '/terms-and-conditions',
  privacyPolicy: '/privacy-policy',
}
export const PrivateRoutes = {
  profile: '/profile'
}
export const AppRoutes = { ...AuthRoutes, ...PublicRoutes, ...PrivateRoutes }