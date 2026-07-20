/** Result returned by admin server actions to their calling client component. */
export interface ActionResult {
  ok: boolean
  error?: string
}
