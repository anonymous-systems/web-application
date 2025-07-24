import { JSX } from 'react'
import { Layout } from '@/components/layout'
import { ThreeDSphere } from '@workspace/ui/components/three-d-sphere/three-d-sphere'

export const HomePage = (): JSX.Element => {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-8 p-[1rem 1rem 88px 1rem]">
        <div className='grid place-content-center w-full min-h-[350px] relative'>
          <ThreeDSphere />
        </div>
      </div>
    </Layout>
  )
}