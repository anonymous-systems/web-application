'use client'

import { JSX, useMemo } from 'react'
// @ts-expect-error Importing styles
import styles from './styles.module.css'
import { SpherePoint } from '@workspace/ui/components/three-d-sphere/sphere-point'

interface Props {
  /** The number of points to distribute on the sphere. */
  points?: number
  /** The radius of the sphere in pixels. */
  radius?: number
  /** The width of the container in pixels. */
  width?: number
  /** The height of the container in pixels. */
  height?: number
  /** Whether the sphere should automatically rotate. */
  rotate?: boolean
  /** The size of each point in pixels. */
  pointSize?: number
}

const calculateSpherePoints = (points: number, radius: number): SpherePoint[] => {
  const spherePoints: SpherePoint[] = []

  for (let i = 1; i <= points; i++) {
    // Phi
    const azimuth = Math.acos(-1 + (2 * i - 1) / points)

    // Theta
    const elevation = Math.sqrt(points * Math.PI) * azimuth

    const x = Math.round(radius * Math.sin(azimuth) * Math.cos(elevation))
    const y = Math.round(radius * Math.sin(azimuth) * Math.sin(elevation))
    const z = Math.round(radius * Math.cos(azimuth))

    const xAngleOfRotation = Math.atan(y / z) * 180 / Math.PI
    const yAngleOfRotation = Math.atan(x / z) * 180 / Math.PI
    const zAngleOfRotation = Math.atan(y / x) * 180 / Math.PI

    spherePoints.push({
      x, y, z,
      xAngleOfRotation, yAngleOfRotation, zAngleOfRotation,
      color: `hsla(${Math.ceil(360 / points * i)}, 50%, 50%, .7)`
    })
  }

  return spherePoints
}

export const ThreeDSphere = ({
  points = 500,
  radius,
  width = 350,
  height = 350,
  rotate = true,
  pointSize = 10
}: Props) : JSX.Element => {
  // Ensure sphere fits inside container
  const effectiveRadius = radius ?? Math.floor(Math.min(width, height) / 2 - pointSize / 2)
  const spherePoints = useMemo(() => calculateSpherePoints(points, effectiveRadius), [points, effectiveRadius])
  const sphereClassName = `${styles.sphere} ${rotate ? styles.rotate : ''}`

  return (
    <div
      id='three-d-sphere'
      className={sphereClassName}
      style={{ width, height }}
      role='region'
      aria-label='3D Sphere Visualization'
    >
      {spherePoints.map((point, index) => (
        <div
          key={index}
          className={styles.point}
          style={{
            left: width / 2 - pointSize / 2,
            top: height / 2 - pointSize / 2,
            backgroundColor: point.color,
            width: pointSize,
            height: pointSize,
            transform: `
              translateX(${point.x}px)
              translateY(${point.y}px)
              translateZ(${point.z}px)
              rotateX(${point.xAngleOfRotation}deg)
              rotateY(${point.yAngleOfRotation}deg)
              rotateZ(${point.zAngleOfRotation}deg)
            `
          }}
          aria-label={`Sphere point ${index + 1}`}
        />
      ))}
    </div>
  )
}