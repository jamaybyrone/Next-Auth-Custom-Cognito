'use client'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useMemberStore } from '@/methods/hooks/store/useMemberStore'

type LoaderProps = {
  override?: boolean
}

export default function Loader({ override = false }: Readonly<LoaderProps>) {
  const { loading, loadingStatus } = useMemberStore()
  return (
    <>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <Box
            sx={{ height: 40, textAlign: 'center' }}
            aria-live="polite"
            aria-label="Do not refresh the page"
          >
            <CircularProgress color="inherit" role="progressbar" />
            <Typography
              variant="body1"
              color="primary"
              sx={{ fontSize: '1em' }}
            >
              {loadingStatus}
            </Typography>
          </Box>
        </Backdrop>
      )}
    </>
  )
}
