import meta from '@/components/meta'
import { data } from './data'

import CommonLayout from '@/layouts/Common'
import Home from '@/layouts/Home'
export const metadata = meta(data.meta)

export default function HomePage() {
  return (
    <CommonLayout>
      <Home />
    </CommonLayout>
  )
}
