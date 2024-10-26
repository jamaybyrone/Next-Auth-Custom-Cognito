import { NextRequest, NextResponse } from 'next/server'

import { CognitoUser } from 'amazon-cognito-identity-js'

import DOMPurify from 'isomorphic-dompurify'
import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'

const schema = z.object({
  emailAddress: z.string().email()
})

async function resend(email: string) {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool
  })
  return new Promise((resolve, reject) =>
    user.resendConfirmationCode((err, result) => {
      if (err) {
        reject(Error(err.message))
      }
      resolve(result)
    })
  )
}

export async function POST(request: NextRequest) {
  const { value: webSessionId } = cookies().get(sessionCookie)
  if (!webSessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const logger = new Log('ResendCode', webSessionId)
  const data = await request.json()
  const response = schema.safeParse(data)
  if (!response.success) {
    const { errors } = response.error
    logger.error(errors)
    return NextResponse.json({ error: errors }, { status: 400 })
  }
  let status = 200

  const { emailAddress } = data
  const cleanEmail = DOMPurify.sanitize(emailAddress)

  await resend(cleanEmail).catch((err) => {
    logger.error(err)
    status = 400
  })

  return NextResponse.json({ email: emailAddress }, { status: status })
}
