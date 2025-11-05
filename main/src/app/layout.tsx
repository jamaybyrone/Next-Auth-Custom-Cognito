import ThemeRegistry from '@/theme/ThemeRegistry'

import { ReactNode } from 'react'
import Loader from '@/components/loader'
import { Metadata } from 'next'
import { HTTPS_WWW_MAIN_DOMAIN } from '@/consts/url'
import { showGitHub, showGoogle } from '@/flags'
import Navigation from '@/components/navigation'
import { SnackBar } from '@/components/SnackBar'
import { checkSession } from '@/methods/db/checkSession'
import { getWebSession } from '@/methods/getWebSession'
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

  if (session) {
    // if there logged in check if the session exists in the historys table
    const webSessionId = await getWebSession()
    await checkSession(session.id, webSessionId)
  }

  const enabledFeatures = {
    googleEnabled: await showGitHub(),
    gitHubEnabled: await showGoogle()
  }

  return (
    <ThemeRegistry features={enabledFeatures}>
      <html lang="en" style={{ height: '100%' }}>
        <body>
          <Navigation isLoggedIn={!!session} />
          <main>{children}</main>
          <Loader />
          <SnackBar />
        </body>
      </html>
    </ThemeRegistry>
  )
}
