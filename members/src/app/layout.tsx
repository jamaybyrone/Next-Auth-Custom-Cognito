import ThemeRegistry from '@/theme/ThemeRegistry'

import { ReactNode } from 'react'
import Loader from '@/components/loader'

import { Metadata } from 'next'
import { HTTPS_WWW_MAIN_DOMAIN } from '@/consts/url'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Navigation, {UserType} from '@/components/navigation'

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
  if (!session) {
    redirect('http://localhost:3000')
  }
  return (
    <ThemeRegistry>
      <html lang="en" style={{ height: '100%' }}>
        <body>
          <Navigation session={session?.user as UserType} />
          <main id={'mainContent'} tabIndex={0}>
            {children}
          </main>
          <Loader />
        </body>
      </html>
    </ThemeRegistry>
  )
}
