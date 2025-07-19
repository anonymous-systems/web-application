export const AuthRoutes = {
  signIn: '/sign-in',
  signUp: '/sign-up',
}
export const PublicRoutes = {
  home: '/',
  welcome: '/welcome',
}
export const AppRoutes = { ...AuthRoutes, ...PublicRoutes }