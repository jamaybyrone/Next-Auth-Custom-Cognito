import meta from '@/components/meta'
import { data } from './data'
import SignIn from '@/layouts/SignIn'

import CommonLayout from '@/layouts/Common'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
export const metadata = meta(data.meta)

export default async function SignInPage() {
  const hasSession = await getServerSession()
  if (hasSession) {
    redirect('/members')
  }

  return (
    <CommonLayout>
      <SignIn />
    </CommonLayout>
  )
}
