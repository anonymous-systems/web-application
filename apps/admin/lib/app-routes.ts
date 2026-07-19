export const PublicRoutes = {
  signIn: '/sign-in',
  signOut: '/sign-out',
}
export const DashboardRoutes = {
  dashboard: '/',
  projects: '/projects',
  categories: '/categories',
  tags: '/tags',
  comments: '/comments',
  stories: '/stories',
  users: '/users',
  files: '/files',
}
export const AppRoutes = { ...PublicRoutes, ...DashboardRoutes }
