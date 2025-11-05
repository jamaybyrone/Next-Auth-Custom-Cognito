'use server'

import { cookies, headers } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'

export const getWebSession = async () => {
  const headerList = await headers()
  const cookieStore = await cookies()

  let { value: webSessionId } = cookieStore.get(sessionCookie) ?? {
    value: null
  }
  if (!webSessionId) {
    webSessionId = headerList.get('x-user-session')
  }
  return webSessionId
}
