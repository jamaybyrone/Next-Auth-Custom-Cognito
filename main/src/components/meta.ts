import { robots, SITE_NAME } from '@/consts/meta'
import { Metadata } from 'next'
import { Robots } from 'next/dist/lib/metadata/types/metadata-types'
const { NEXT_PUBLIC_LOCALE } = process.env

export type pageMetaType = {
  meta: metaProps
}

export type metaProps = {
  title: string
  url: string
  description: string
  crawlers?: Robots
}
export default function meta(meta: metaProps, crawlers = robots): Metadata {
  return {
    title: meta.title,
    metadataBase: new URL(meta.url),
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.url,
      siteName: SITE_NAME,
      images: [
        {
          url: meta.image,
          width: 800,
          height: 600
        }
      ],
      locale: NEXT_PUBLIC_LOCALE,
      type: 'website'
    },
    robots: crawlers
  }
}
