'use client'
import { JSX } from 'react'
import { Box, Button, Card, Typography } from '@mui/material'
import { CompanyInformation } from '@/company-information'
import Logo from '@/assets/svgs/logo.svg'

const WelcomePage = (): JSX.Element => {
  const { name, byline } = CompanyInformation

  return (
    <Box sx={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderRadius: '.75rem',
          border: '1px solid #ccc',
          width: '360px',
          padding: '2rem',
          alignItems: 'center'
        }}
      >
        <Logo width={150} height={150} alt={`${name} Logo`} />
        <Typography variant='h4' textAlign='center'>Welcome to {name}</Typography>
        <Typography variant='body1' color='textSecondary' textAlign='center'>{byline}</Typography>
        <Button fullWidth variant='contained' onClick={() => {}}>
          Get started
        </Button>
        <Box display='flex' flexWrap='wrap' alignItems='center' justifyContent='center'>
          <Typography variant='body1'>You don&apos;t have an account?</Typography>
          <Button variant='text' onClick={() => {}}>Sign up</Button>
        </Box>
      </Card>
    </Box>
  )
}

export default WelcomePage