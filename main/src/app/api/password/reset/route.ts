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
  code: z.string(),
  confirm_password: z.string()
})

async function resetPassword(username: string, code: string, password: string) {
  const user = new CognitoUser({ Username: username, Pool: userPool })

  return new Promise((resolve, reject) =>
    user.confirmPassword(code, password, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(Error(err.message))
    })
  )
}

export async function POST(request: NextRequest) {
  const { value: webSessionId } = cookies().get(sessionCookie)
  if (!webSessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const logger = new Log('ResetPassword', webSessionId)

  const data = await request.json()
  const response = schema.safeParse(data)
  if (!response.success) {
    const { errors } = response.error
    logger.error(errors)
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  const { emailAddress, code, confirm_password } = data

  const cleanEmail = DOMPurify.sanitize(emailAddress)
  const cleanCode = DOMPurify.sanitize(code)
  const cleanPassword = DOMPurify.sanitize(confirm_password)

  let status = 200

  await resetPassword(cleanEmail, cleanCode, cleanPassword).catch((err) => {
    logger.error(err)
    // codes can be: LimitExceededException or CodeMismatchException
    status = 400
  })

  return NextResponse.json({ email: emailAddress }, { status: status })
}
