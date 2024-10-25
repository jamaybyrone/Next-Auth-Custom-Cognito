import ThemeRegistry from '@/theme/ThemeRegistry'

import { ReactNode } from 'react'
import Loader from '@/components/loader'
import { Metadata } from 'next'
import { HTTPS_WWW_MAIN_DOMAIN } from '@/consts/url'

import { getServerSession } from 'next-auth'
import { showGitHub, showGoogle } from '@/flags'
import Navigation, { UserType } from '@/components/navigation'

export const metadata: Metadata = {
  metadataBase: new URL(HTTPS_WWW_MAIN_DOMAIN),
  alternates: {
    canonical: './'
  }
}

export default async function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession()

  const enabledFeatures = {
    googleEnabled: await showGitHub(),
    gitHubEnabled: await showGoogle()
  }

  return (
    <ThemeRegistry features={enabledFeatures}>
      <html lang="en" style={{ height: '100%' }}>
        <body>
          <Navigation session={session?.user as UserType} />
          <main tabIndex={0}>{children}</main>
          <Loader />
        </body>
      </html>
    </ThemeRegistry>
  )
}
