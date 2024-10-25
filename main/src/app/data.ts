import { pageMetaType } from '@/components/meta'
import { SITE_NAME } from '@/consts/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Welcome ' + SITE_NAME,
    description: SITE_NAME + ' welcome to this website',
    image: `${NEXT_PUBLIC_URL}/images/backgrounds/og-1.jpg`,
    url: NEXT_PUBLIC_URL
  }
}
