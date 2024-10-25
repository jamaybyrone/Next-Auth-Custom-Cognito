import { Viewport } from 'next'
import meta from '@/components/meta'
import { data } from './data'
import { viewPort } from '@/consts/meta'
import CommonLayout from '@/layouts/Common'
import MembersLayout from '@/layouts/Members'

export const viewport: Viewport = viewPort
export const metadata = meta(data.meta)

export default function MembersPage() {
  return <CommonLayout><MembersLayout /></CommonLayout>
}
