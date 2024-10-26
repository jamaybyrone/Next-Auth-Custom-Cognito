import meta from '@/components/meta'
import { data } from './data'
import CommonLayout from '@/layouts/Common'
import MembersLayout from '@/layouts/Members'

export const metadata = meta(data.meta)
export default function MembersPage() {
  return (
    <CommonLayout>
      <MembersLayout />
    </CommonLayout>
  )
}
