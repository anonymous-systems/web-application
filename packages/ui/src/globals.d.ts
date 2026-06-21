// Type declarations for CSS module imports (must be declared before general CSS)
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// Type declarations for general CSS imports
declare module '*.css' {
  const content: string
  export default content
}
