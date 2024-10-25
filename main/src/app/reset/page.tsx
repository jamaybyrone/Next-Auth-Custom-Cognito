import meta from '@/components/meta'
import { data } from './data'

import CommonLayout from '@/layouts/Common'
import Reset from '@/layouts/Reset'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = meta(data.meta)

export default async function ResetPage() {
  const hasSession = await getServerSession()
  if (hasSession) {
    redirect('/members')
  }
  return (
    <CommonLayout>
      <Reset />
    </CommonLayout>
  )
}
