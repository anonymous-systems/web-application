import { describe, expect, it } from 'vitest'
import { magneticOffset } from './magnetic'

// A 200×100 box at (100, 100) → centre (200, 150).
const rect = { left: 100, top: 100, width: 200, height: 100 }

describe('magneticOffset', () => {
  it('pulls toward the pointer, scaled by strength', () => {
    // Pointer 100px right and 50px below the centre, at 40% strength.
    expect(magneticOffset({ x: 300, y: 200 }, rect, 0.4)).toEqual({ x: 40, y: 20 })
  })

  it('returns no offset when the pointer sits on the centre', () => {
    expect(magneticOffset({ x: 200, y: 150 }, rect, 0.4)).toEqual({ x: 0, y: 0 })
  })

  it('stays put when strength is 0', () => {
    expect(magneticOffset({ x: 0, y: 0 }, rect, 0)).toEqual({ x: 0, y: 0 })
  })

  it('follows the pointer past the top-left with negative offsets', () => {
    expect(magneticOffset({ x: 150, y: 100 }, rect, 0.5)).toEqual({ x: -25, y: -25 })
  })
})
