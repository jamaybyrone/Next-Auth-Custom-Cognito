import meta from '@/components/meta'
import { data } from './data'

import CommonLayout from '@/layouts/Common'
import Confirm from '@/layouts//Confirm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata = meta(data.meta)

export default async function ConfirmPage() {
  const hasSession = await getServerSession()
  if (hasSession) {
    redirect('/members')
  }

  return (
    <CommonLayout>
      <Confirm />
    </CommonLayout>
  )
}
