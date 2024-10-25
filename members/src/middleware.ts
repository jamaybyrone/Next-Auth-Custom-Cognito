import { NextRequest, NextResponse } from 'next/server'
import { v4 } from 'uuid'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const session = request.cookies.get(sessionCookie)?.value
  if (!session) {
    const id = v4()
    response.cookies.set(sessionCookie, id, {
      secure: true,
      sameSite: 'strict'
    })
    const logger = new Log('Session Creation', id)
    logger.info('new session set')
  }

  return response
}
