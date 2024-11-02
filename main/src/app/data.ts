import { pageMetaType } from '@/components/meta'
import { SITE_NAME } from '@/consts/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Welcome ' + SITE_NAME,
    description: SITE_NAME + ' welcome to this website',
    url: NEXT_PUBLIC_URL
  }
}
