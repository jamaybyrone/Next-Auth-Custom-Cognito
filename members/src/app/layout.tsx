import ThemeRegistry from '@/theme/ThemeRegistry'

import { ReactNode } from 'react'
import Loader from '@/components/loader'

import { Metadata } from 'next'
import { HTTPS_WWW_MAIN_DOMAIN } from '@/consts/url'
import { redirect } from 'next/navigation'
import Navigation from '@/components/navigation'
import { getWebSession } from '@/methods/getWebSession'
import { checkSession } from '@/methods/db/checkSession'
import { getServerSideSessionFromToken } from '@/methods/getServerSideSessionFromToken'

export const metadata: Metadata = {
  metadataBase: new URL(HTTPS_WWW_MAIN_DOMAIN),
  alternates: {
    canonical: './'
  }
}

export default async function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const session = await getServerSideSessionFromToken()
  if (!session) {
    redirect('http://localhost:3000')
  }
  const webSessionId = await getWebSession()

  await checkSession(session.id, webSessionId)
  return (
    <ThemeRegistry>
      <html lang="en" style={{ height: '100%' }}>
        <body>
          <Navigation isLoggedIn={!!session} />
          <main id={'mainContent'}>{children}</main>
          <Loader />
        </body>
      </html>
    </ThemeRegistry>
  )
}
