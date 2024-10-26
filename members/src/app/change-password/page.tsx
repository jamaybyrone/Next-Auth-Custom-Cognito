import meta from '@/components/meta'
import { data } from './data'

import CommonLayout from '@/layouts/Common'
import ChangePasswordLayout from '@/layouts/ChangePassword'
export const metadata = meta(data.meta)

export default function ChangePasswordPage() {
  return (
    <CommonLayout>
      <ChangePasswordLayout />
    </CommonLayout>
  )
}
