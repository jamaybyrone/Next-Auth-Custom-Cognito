import { Robots } from 'next/dist/lib/metadata/types/metadata-types'
export const SITE_NAME: string = 'Cognito Custom Auth'
export const robots: Robots = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1
  }
}

export const REVALIDATE_LIMIT = 3600
