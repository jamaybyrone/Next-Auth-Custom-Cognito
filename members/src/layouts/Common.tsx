'use client'

import { ReactNode, Suspense } from 'react'
import Loader from '@/components/loader'
import Stack from '@mui/material/Stack'

export default function CommonLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense fallback={<Loader override={true} />}>
      <Stack
        direction="column"
        component="section"
        sx={[
          {
            justifyContent: 'space-between',
            height: { xs: 'auto', md: '100%' }
          }
        ]}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: 'auto'
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Suspense>
  )
}
