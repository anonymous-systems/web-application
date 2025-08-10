'use client'

import { ElementType, JSX } from 'react'
import { Layout } from '@/components/layout'
import { UserAvatar } from '@/components/user-avatar'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@workspace/ui/components/button'
import { ArrowRight, BookOpen, FolderOpen } from 'lucide-react'
import { UserProfile } from '@workspace/ui/models/interfaces/user-profile'

interface Props {
  userProfile: UserProfile | null
}
export const ProfilePage = (props: Props): JSX.Element => {
  const { user } = useAuth()

  if (user == null) return <></>

  interface MockProject {
    id: string
    name: string
    description: string
  }
  const projects: MockProject[] = []

  type MockStory = MockProject
  const stories: MockStory[] = []

  return (
    <Layout dataTestId='profilePage'>
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
              <h2 className='title-lg' data-testid='displayName'>{user.displayName}</h2>
              <p className='body-md' data-testid='username'>@{props.userProfile?.username}</p>
            </div>
          </div>
        </section>

        <section id='projects' className='flex flex-col gap-2 border rounded-2xl p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='title-lg'>Projects</h2>

            <Button disabled variant='ghost'>View all</Button>
          </div>

          {projects.length === 0 && (
            // <p className='body-md text-muted-foreground'>No projects found.</p>
            <ComingSoonPlaceholder
              icon={FolderOpen}
              title='Projects'
              description='You will be able to create and manage your projects here soon. Stay tuned for updates!'
            />
          )}

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
            <h2 className='title-lg'>Stories</h2>

            <Button disabled variant='ghost'>View all</Button>
          </div>

          {stories.length === 0 && (
            // <p className='body-md text-muted-foreground'>No stories found.</p>
            <ComingSoonPlaceholder
              icon={BookOpen}
              title='Stories'
              description='Stories will help you share progress and updates. This feature is coming soon!'
            />
          )}

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

const ComingSoonPlaceholder = ({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType
  title: string
  description: string
}): JSX.Element => (
  <div className='flex flex-col items-center justify-center py-8 gap-2'>
    <span className='bg-accent rounded-full p-4'>
      <Icon className='w-8 h-8 text-muted-foreground' aria-hidden='true' />
    </span>
    <span className='inline-flex items-center gap-2'>
      <span className='font-semibold text-lg'>{title}</span>
      <span className='bg-card text-card-foreground text-xs px-2 py-1 border-2 rounded-full'>Coming Soon</span>
    </span>
    <p className='body-md text-muted-foreground text-center max-w-xs'>{description}</p>
  </div>
)