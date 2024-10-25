import { Robots } from 'next/dist/lib/metadata/types/metadata-types'
export const SITE_NAME: string = 'Jamie Byrne Nature & Landscape Photography'
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

