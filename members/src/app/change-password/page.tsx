import { Viewport } from 'next'
import meta from '@/components/meta'
import { data } from './data'
import { viewPort } from '@/consts/meta'
import CommonLayout from '@/layouts/Common'
import ChangePasswordLayout from '@/layouts/ChangePassword'

export const viewport: Viewport = viewPort
export const metadata = meta(data.meta)

export default function ChangePasswordPage() {
  return <CommonLayout><ChangePasswordLayout /></CommonLayout>
}
