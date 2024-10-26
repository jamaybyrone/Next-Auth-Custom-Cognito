'use client'

import { ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Poppins } from 'next/font/google'
import { BLACK, GREEN } from '@/consts/colours'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

const poppins = Poppins({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin']
})

const theme = createTheme({
  typography: {
    allVariants: {
      color: BLACK,
      fontFamily: poppins.style.fontFamily
    },
    body1: {
      fontFamily: poppins.style.fontFamily,
      color: BLACK
    }
  },
  palette: {
    primary: {
      main: BLACK
    },
    secondary: {
      main: GREEN
    }
  }
})
export default function ThemeRegistry({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            body: {
              margin: 0,
              width: '100%',
              height: '100%'
            },
            main: {
              height: '100%'
            }
          }}
        />
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
