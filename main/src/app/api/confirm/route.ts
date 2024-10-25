import { NextRequest, NextResponse } from 'next/server'

import { CognitoUser } from 'amazon-cognito-identity-js'

import DOMPurify from 'isomorphic-dompurify'
import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'

const schema = z.object({
  emailAddress: z.string().email(),
  code: z.string()
})
async function confirm(email: string, code: string) {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool
  })
  return new Promise((resolve, reject) =>
    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  )
}

export async function POST(request: NextRequest) {
  const { value: webSessionId } = cookies().get(sessionCookie)!
  if (!webSessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const logger = new Log('ConfirmAccount', webSessionId)

  const data = await request.json()
  const response = schema.safeParse(data)
  if (!response.success) {
    const { errors } = response.error
    logger.error(errors)
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  let status = 200
  const { emailAddress, code } = data
  const cleanEmail = DOMPurify.sanitize(emailAddress)
  const cleanCode = DOMPurify.sanitize(code)

  await confirm(cleanEmail, cleanCode).catch((err) => {
    logger.error(err)
    status = 400
  })

  return NextResponse.json({ email: emailAddress }, { status: status })
}
