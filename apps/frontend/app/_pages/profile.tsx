'use client'

import { JSX } from 'react'
import { Layout } from '@/components/layout'
import { UserAvatar } from '@/components/user-avatar'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@workspace/ui/components/button'
import { ArrowRight } from 'lucide-react'
import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'

interface Props {
  userProfile: UserProfile | null
}
export const ProfilePage = (props: Props): JSX.Element => {
  const { user } = useAuth()

  if (user == null) return <></>

  const projects = [
    {
      id: '1',
      name: 'Project One',
      description: 'Project Description'
    },
    {
      id: '2',
      name: 'Project Two',
      description: 'Project Description'
    }
  ]

  const stories = [
    {
      id: '1',
      name: 'Story One',
      description: 'Story Description'
    },
    {
      id: '2',
      name: 'Story Two',
      description: 'Story Description'
    }
  ]

  return (
    <Layout>
      <div className='flex flex-col gap-4 p-4'>
        <section className='relative'>
          <div
            id='banner'
            className='rounded-2xl w-full absolute'
            style={{
              zIndex: -1,
              height: 150,
              background: 'linear-gradient(82deg, #6750A4 0%, #D0BCFF 19.79%, #EFB8C8 40.62%, #D0BCFF 59.37%, #EFB8C8 75.52%, #FFD8E4 100%)'
            }}
          />

          <div className='mt-[125px] flex items-center z-50'>
            <picture className='p-2 block bg-background rounded-full'>
              <UserAvatar user={user} className='aspect-square w-[112px] h-[112px] text-5xl' />
            </picture>
            <div>
              <h2 className='title-lg'>{user.displayName}</h2>
              <p className='body-md'>@{props.userProfile?.username}</p>
            </div>
          </div>
        </section>

        <section id='projects' className='flex flex-col gap-2 border rounded-2xl p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='title-lg'>Recent Projects</h2>

            <Button variant='ghost'>View all</Button>
          </div>

          {projects.map(project => (
            <div
              key={project.id}
              className='border rounded-2xl py-2 pl-4 pr-6 flex items-center justify-between transition-colors hover:bg-accent cursor-pointer'
            >
              <div className='flex flex-col'>
                <p className='body-lg'>{project.name}</p>
                <p className='body-md text-muted-foreground'>{project.description}</p>
              </div>
              <ArrowRight />
            </div>
          ))}
        </section>

        <section id='stories' className='flex flex-col gap-2 border rounded-2xl p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='title-lg'>Recent Stories</h2>

            <Button variant='ghost'>View all</Button>
          </div>

          {stories.map(story => (
            <div key={story.id} className='border rounded-2xl py-2 pl-4 pr-6 flex items-center justify-between transition-colors hover:bg-accent cursor-pointer'>
              <div className='flex flex-col'>
                <p className='body-lg'>{story.name}</p>
                <p className='body-md text-muted-foreground'>{story.description}</p>
              </div>
              <ArrowRight />
            </div>
          ))}
        </section>
      </div>
    </Layout>
  )
}