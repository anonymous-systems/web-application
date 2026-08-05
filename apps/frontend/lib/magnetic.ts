export interface Point {
  x: number
  y: number
}

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * The offset a magnetic element should follow: the pointer's distance from the
 * element's centre, scaled by `strength` (0 = inert, 1 = sticks to the pointer).
 * Pure, so the physics can be unit-tested without a DOM.
 */
export const magneticOffset = (
  pointer: Point,
  rect: Rect,
  strength: number
): Point => {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // `|| 0` collapses -0 (e.g. a left-of-centre pointer at strength 0) to 0.
  return {
    x: (pointer.x - centerX) * strength || 0,
    y: (pointer.y - centerY) * strength || 0,
  }
}
