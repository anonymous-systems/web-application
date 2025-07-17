'use client'

import { JSX } from 'react'
import { toast } from '@workspace/ui/components/sonner.js'
import { Button } from '@workspace/ui/components/button.js'

export const TestClientComponent = (): JSX.Element => {
  const handleButtonClick = (): void => {
    toast("Hello from the frontend app!")
  }

  return (
    <>
      <h2 className="text-2xl font-bold">Test Client Component</h2>
      <Button size="sm" onClick={handleButtonClick}>Button</Button>
    </>
  )
}