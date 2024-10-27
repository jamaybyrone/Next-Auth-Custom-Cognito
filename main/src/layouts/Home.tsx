'use client'

import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import { defaultCardStyle } from '@/consts/styles'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

const Card = styled(MuiCard)(({ theme }) => ({ ...defaultCardStyle(theme) }))

export default function Home() {
  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Welcome!
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <Typography sx={{ textAlign: 'center' }}>
          This is a demo app.
        </Typography>
        <Typography sx={{ textAlign: 'center' }}>
          This page can be visited regardless if you are logged in or not.
        </Typography>
      </Box>
    </Card>
  )
}
