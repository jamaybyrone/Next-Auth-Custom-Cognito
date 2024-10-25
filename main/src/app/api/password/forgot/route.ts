import { NextRequest, NextResponse } from 'next/server'

import { CognitoUser } from 'amazon-cognito-identity-js'

import DOMPurify from 'isomorphic-dompurify'
import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'

const schema = z.object({
  forgotEmailAddress: z.string().email()
})

async function forgotPassword(username: string) {
  const user = new CognitoUser({ Username: username, Pool: userPool })

  return new Promise((resolve, reject) =>
    user.forgotPassword({
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err)
    })
  )
}

export async function GET(request: NextRequest) {
  const { value: webSessionId } = cookies().get(sessionCookie)!

  if (!webSessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const logger = new Log('ForgotPassword', webSessionId)
  const { searchParams } = request.nextUrl
  const data = Object.fromEntries(searchParams.entries())
  const response = schema.safeParse(data)
  if (!response.success) {
    const { errors } = response.error
    logger.error(errors)
    return NextResponse.json({ error: errors }, { status: 400 })
  }
  const cleanEmail = DOMPurify.sanitize(data.forgotEmailAddress)
  let status = 200

  await forgotPassword(cleanEmail)
    .then((response: any) => {
      if (response.toString().includes('Attempt limit exceeded')) {
        logger.warn('Attempt limit exceeded for ' + cleanEmail)
        status = 400
      }
    })
    .catch((error) => {
      logger.error(error)
      status = 200 // security, don't say if the email doesn't exists, or if it failed...
    })

  return NextResponse.json({ email: cleanEmail }, { status: status })
}
