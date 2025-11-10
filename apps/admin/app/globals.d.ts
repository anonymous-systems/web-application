// Type declarations for workspace CSS imports
declare module '@workspace/ui/globals.css' {
  const content: string
  export default content
}

declare module '@workspace/ui/*.css' {
  const content: string
  export default content
}

declare module '@workspace/ui/*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// General CSS module declarations
declare module '*.css' {
  const content: string
  export default content
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
