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
    robots: crawlers
  }
}
