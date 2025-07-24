'use client'

import { JSX, useEffect, useRef } from 'react'
// @ts-expect-error Importing styles
import styles from './styles.module.css'

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  xAngleOfRotation: number;
  yAngleOfRotation: number;
  zAngleOfRotation: number;
  color: string;
}

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
}

export const ThreeDSphere = ({
  points = 500,
  radius = 160,
  width = 200,
  height = 200,
  rotate = true
}: Props) : JSX.Element => {
  const sphereRef = useRef<HTMLDivElement | null>(null)
  // Generate 3D Sphere
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

  const createPointElement = (point: SpherePoint, elementId?: string): HTMLDivElement => {
    const divElement = document.createElement('div')

    divElement.id = elementId || `point${point.x}${point.y}${point.z}`

    const elementStyles = {
      position: 'absolute',
      left: '90px',
      top: '90px',
      width: '10px',
      height: '10px',
      backgroundColor: point.color,
      transform: `translateX(${point.x}px) translateY(${point.y}px) translateZ(${point.z}px) rotateX(${point.xAngleOfRotation}deg) rotateY(${point.yAngleOfRotation}deg) rotateZ(${point.zAngleOfRotation}deg)`
    }

    Object.assign(divElement.style, elementStyles)

    return divElement
  }

  useEffect(() => {
    const generateSphere = (
      points: number, radius: number, width: number, height: number
    ): void => {
      if (sphereRef.current == null) return
      const start = performance.now()

      const sphereElement = sphereRef.current

      sphereElement.style.width = `${width}px`
      sphereElement.style.height = `${height}px`
      sphereElement.innerHTML = ''

      const spherePoints = calculateSpherePoints(points, radius)

      spherePoints.forEach((point, index) => {
        const pointElement = createPointElement(point, `point${index + 1}`)

        sphereElement.appendChild(pointElement)
      })

      const generationTime = performance.now() - start

      console.debug(`Generated 3D sphere in ${Number(generationTime).toFixed(2)}ms`)
    }

    generateSphere(points, radius, width, height)
  }, [points, radius, width, height])

  const sphereClassName = `${styles.sphere} ${rotate ? styles.rotate : ''}`

  return <div id='three-d-sphere' ref={sphereRef} className={sphereClassName} />
}