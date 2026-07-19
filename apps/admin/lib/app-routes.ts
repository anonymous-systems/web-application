export const PublicRoutes = {
  signIn: '/sign-in',
  signOut: '/sign-out',
}
export const PrivateRoutes = {
  dashboard: '/',
}
export const AppRoutes = { ...PublicRoutes, ...PrivateRoutes }
