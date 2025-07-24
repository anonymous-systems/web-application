import { JSX } from 'react'
import { Layout } from '@/components/layout'
import { ThreeDSphere } from '@workspace/ui/components/three-d-sphere/three-d-sphere'
import { Button } from '@workspace/ui/components/button'
import { CalendarDays, Mail, Star, StarHalf } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem, CarouselNext,
  CarouselPrevious
} from '@workspace/ui/components/carousel'
import { Divider } from '@workspace/ui/components/divider'
import { Card, CardContent } from '@workspace/ui/components/card'

export const HomePage = (): JSX.Element => {
  const testimonials = [
    {
      id: '1',
      content: 'Since partnering with TechConsult, our business has seen significant growth.',
      rating: 5,
      name: 'Jane Smith',
      position: 'Lead Consultant'
    },
    {
      id: '2',
      content: 'I recommend TechConsult to any business looking for improvement.',
      rating: 5,
      name: 'John Doe',
      position: 'Product Manager'
    },
    {
      id: '3',
      content: 'I can\'t imagine running our company without TechConsult.',
      rating: 4.5,
      name: 'Ben Clock',
      position: 'CTO, TechConsult'
    }
  ]

  return (
    <Layout>
      <div className="flex flex-col items-center gap-8 p-4 pb-24">
        <section id='hero' className='flex flex-col items-center gap-4'>
          <ThreeDSphere/>

          <div className='flex flex-col gap-2'>
            <h2 className="title-lg">Expert Consulting Services for Technology</h2>

            <p className='body-lg'>Get in touch with our team of experts for professional consulting services.</p>
          </div>

          <Button size='lg'>
            <CalendarDays />
            Schedule Consultation
          </Button>
        </section>

        <section id='topics' className='flex flex-col gap-4'>
          <h2 className='title-lg'>Explore Our Popular Topics</h2>

          <div className='flex gap-2 flex-wrap'>
            <Button variant='outline' size='sm'>Angular</Button>
            <Button variant='outline' size='sm'>React</Button>
            <Button variant='outline' size='sm'>Google</Button>
            <Button variant='outline' size='sm'>Stripe</Button>
            <Button variant='outline' size='sm'>Firebase</Button>
          </div>
        </section>

        <section id='projects' className='flex flex-col items-center gap-4'>
          <h2 className='title-lg'>Introducing Anonymous Systems</h2>

          <p className='body-lg'>Join our community and experience the benefits today!</p>

          <Button size='lg'>
            <Mail />
            Contact Us
          </Button>

          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className='basis-1/3'>
                  {/*<div className='bg-accent text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm'>*/}
                  {/*  <div className='flex aspect-square items-center justify-center p-6'>*/}
                  {/*    <span className="text-4xl font-semibold">{index + 1}</span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section id='smart-solutions' className='flex flex-col items-center gap-4'>
          <h4 className='w-full font-semibold'>Smart Solutions</h4>

          <h2 className='title-lg'>All your tech needs in one place</h2>

          <p className='body-lg'>
            We provide comprehensive technology consulting services, helping businesses leverage the
            latest advancements to drive growth and success. Our team of experts is dedicated to
            delivering tailored solutions that meet your unique requirements.
          </p>

          <Button variant='outline' size='lg'>Learn More</Button>

          <picture className='bg-accent w-full h-[300px] rounded-2xl'></picture>
        </section>

        <section id='cost-effective-solutions' className='flex flex-col items-center gap-4'>
          <h4 className='w-full font-semibold'>Cost-effective Solutions</h4>

          <h2 className='title'>Achieve cost savings with Anonymous Systems</h2>

          <p className='body-lg'>
            Our cost-effective solutions are designed to optimize your business operations,
            reduce expenses, and maximize efficiency. With advanced analytics and industry
            expertise, we identify areas for improvement and implement strategies to streamline your processes.
          </p>

          <Button variant='outline' size='lg'>
            <Mail />
            Contact Us
          </Button>

          <picture className='bg-accent w-full h-[300px] rounded-2xl' />
        </section>

        <section id='services' className='flex flex-col items-center gap-4 bg-accent p-4 rounded-2xl'>
          <div className='flex flex-col gap-2'>
            <h4 className='w-full font-semibold'>Services</h4>

            <h2 className='title-lg'>Experience Excellence</h2>

            <p className='body-lg'>
              Sign up for a free consultation and experience the excellence of our consulting services.
              Our experts will demonstrate how we can help your business thrive.
            </p>
          </div>

          <Button size='lg'>
            <CalendarDays />
            Schedule Consultation
          </Button>

          <picture className='bg-card w-full h-[300px] rounded-2xl' />
        </section>

        <section id='steps' className='flex flex-col items-center gap-4 bg-accent p-4 rounded-2xl'>
          <div className='flex flex-col gap-2'>
            <h2 className='title-lg'>Discover the benefits of working with us</h2>
            <p className='body-lg'>Unlock your business potential in just 3 steps.</p>
          </div>

          <picture className='bg-card w-full h-[300px] rounded-2xl'/>

          <div className='flex flex-col gap-2'>
             <h2 className='headline-sm'>Step 1</h2>
             <p className='body-lg'>Get in touch with us for a consultation.</p>

            <Divider />

             <h2 className='headline-sm'>Step 2</h2>
             <p className='body-lg'>Our experts with assess your needs and provide personalized recommendations.</p>

            <Divider />

            <h2 className='headline-sm'>Step 3</h2>
            <p className='body-lg'>Unlock your full potential with our optimized operations.</p>
          </div>

          <Button size='lg'>Get Started</Button>
        </section>

        <section id='testimonials' className='flex flex-col items-center gap-4'>
          <div className='flex flex-col gap-2'>
            <h2 className='title-lg'>Testimonials</h2>
            <p className='body-lg'>Clients Love Our Services</p>
          </div>

          <div className='flex flex-col gap-2'>
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className='bg-accent p-4 flex flex-col items-center gap-2 rounded-2xl'
              >
                <p className='label-lg'>{testimonial.content}</p>
                <div className='flex gap-2 relative'>
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className='fill-card' strokeWidth={0} />
                  ))}
                  <div className='flex gap-2 absolute'>
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <Star key={i} className='fill-current' strokeWidth={0} />
                    ))}
                    {testimonial.rating % 1 !== 0 && (
                      <StarHalf key="half" className='fill-current' strokeWidth={0} />
                    )}
                  </div>
                </div>
                <p className='label-lg font-semibold'>{testimonial.name}</p>
                <p>{testimonial.position}</p>
              </div>
            ))}
          </div>
        </section>

        <section id='get-started' className='flex flex-col items-center gap-4 bg-accent p-4 rounded-2xl'>
          <div className='flex flex-col gap-2'>
            <h2 className='title-lg'>Get Started with a Free Consultation Today</h2>
            <p className='body-lg'>Optimize Your Process Now</p>
          </div>
          <Button size='lg'>Get Started</Button>
          <picture className='bg-card w-full h-[300px] rounded-2xl' />
        </section>
      </div>
    </Layout>
  )
}