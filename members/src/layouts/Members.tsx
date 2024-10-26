'use client'

import { useSearchParams } from 'next/navigation'
import CheckIcon from '@mui/icons-material/Check'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import MuiCard from '@mui/material/Card'
import { defaultCardStyle } from '@/consts/styles'

const Card = styled(MuiCard)(({ theme }) => ({ ...defaultCardStyle(theme) }))

const MembersLayout = () => {
  const searchParams = useSearchParams()

  const changed = searchParams.get('change')

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Members Area
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {changed && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Password changed!
          </Alert>
        )}
      </Box>
    </Card>
  )
}
export default MembersLayout
