// Native <select> styled to match the shared Input; the OS picker it triggers is
// the friendliest control on touch devices. Shared by the story and project forms.
export const SELECT_CONTROL_CLASS =
  'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

export const titleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)
