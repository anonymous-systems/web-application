import React, { JSX, useEffect, useRef } from 'react'

interface Props {
  open: boolean
  'aria-label'?: string
}
export const MenuIcon= (props: Props): JSX.Element => {
  const openTopRef = useRef<SVGAnimateElement>(null)
  const closeTopRef = useRef<SVGAnimateElement>(null)
  const openBottomRef = useRef<SVGAnimateElement>(null)
  const closeBottomRef = useRef<SVGAnimateElement>(null)

  useEffect(() => {
    if (props.open) {
      openTopRef.current?.beginElement()
      openBottomRef.current?.beginElement()
    } else {
      closeTopRef.current?.beginElement()
      closeBottomRef.current?.beginElement()
    }
  }, [props.open])

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-label={props['aria-label'] ?? 'Toggle Menu'}
      role="img"
      focusable="false"
    >
      <polyline
        id="menutrigger-bread-top"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="2 5, 16 5"
      >
        <animate
          ref={openTopRef}
          id="anim-menutrigger-bread-top-open"
          attributeName="points"
          keyTimes="0;0.5;1"
          dur="0.24s"
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
          values="2 5, 16 5; 2 9, 16 9; 3.5 3.5, 15 15"
        />
        <animate
          ref={closeTopRef}
          id="anim-menutrigger-bread-top-close"
          attributeName="points"
          keyTimes="0;0.5;1"
          dur="0.24s"
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
          values="3.5 3.5, 15 15; 2 9, 16 9; 2 5, 16 5"
        />
      </polyline>
      <polyline
        id="menutrigger-bread-bottom"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="2 12, 16 12"
      >
        <animate
          ref={openBottomRef}
          id="anim-menutrigger-bread-bottom-open"
          attributeName="points"
          keyTimes="0;0.5;1"
          dur="0.24s"
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
          values="2 12, 16 12; 2 9, 16 9; 3.5 15, 15 3.5"
        />
        <animate
          ref={closeBottomRef}
          id="anim-menutrigger-bread-bottom-close"
          attributeName="points"
          keyTimes="0;0.5;1"
          dur="0.24s"
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1"
          values="3.5 15, 15 3.5; 2 9, 16 9; 2 12, 16 12"
        />
      </polyline>
    </svg>
  )
}