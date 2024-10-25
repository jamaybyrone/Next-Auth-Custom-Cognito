import { SITE_NAME } from '@/consts/meta'
import { pageMetaType } from '@/components/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Members Area -' + SITE_NAME,
    description: SITE_NAME + ' sign in to this website',
    image: `${NEXT_PUBLIC_URL}/images/backgrounds/og-1.jpg`,
    url: NEXT_PUBLIC_URL!
  }
}
