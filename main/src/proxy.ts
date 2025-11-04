import { NextRequest, NextResponse } from 'next/server'
import { v4 } from 'uuid'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/utils/logger'

const { LOG_LEVEL } = process.env
export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  const session =
    request.cookies.get(sessionCookie)?.value ??
    request.headers.get('x-user-session')
  if (!session) {
    const id = v4()
    response.cookies.set(sessionCookie, id, {
      secure: true,
      sameSite: 'lax'
    })
    response.headers.set('x-user-session', id)

    const logger = new Log('Session Creation')
    if (LOG_LEVEL === 'debug') {
      logger.info('Incoming request path: ' + request.nextUrl.pathname, id)
    }

    logger.info('new session set', id)
  }

  return response
}
export const config = {
  matcher: [
    '/',
    '/((?!api|_next|static|favicon.ico|public|images|fonts|styles|scripts).*)'
  ]
}
