import meta from '@/components/meta'
import { data } from './data'

import { redirect } from 'next/navigation'
import CommonLayout from '@/layouts/Common'
import SignUp from '@/layouts/SignUp'
import { getServerSession } from 'next-auth'

export const metadata = meta(data.meta)

export default async function SignUpPage() {
  const hasSession = await getServerSession()
  if (hasSession) {
    redirect('/members')
  }

  return (
    <CommonLayout>
      <SignUp />
    </CommonLayout>
  )
}
