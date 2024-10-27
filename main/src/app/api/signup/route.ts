import { NextRequest, NextResponse } from 'next/server'

import { CognitoUserAttribute } from 'amazon-cognito-identity-js'

import DOMPurify from 'isomorphic-dompurify'
import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'
import { createNewUserSession } from '@/utils/dynamoDB'

const schema = z.object({
  emailAddress: z.string().email(),
  password: z.string(),
  name: z.string()
})
async function registerCognito(
  user: string,
  pass: string,
  attributes: CognitoUserAttribute[]
) {
  return new Promise((resolve, reject) => {
    userPool.signUp(user, pass, attributes, attributes, (err, result) => {
      if (err) {
        reject(new Error(err.message))
      } else {
        resolve(result)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  const { value: webSessionId } = cookies().get(sessionCookie)
  if (!webSessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }

  const logger = new Log('SignUp', webSessionId)

  const data = await request.json()
  const response = schema.safeParse(data)
  if (!response.success) {
    const { errors } = response.error
    logger.error(errors)
    return NextResponse.json({ error: errors }, { status: 400 })
  }

  let status = 200

  const { emailAddress, password, name } = data

  const cleanEmail = DOMPurify.sanitize(emailAddress)
  const cleanPassword = DOMPurify.sanitize(password)
  const cleanName = DOMPurify.sanitize(name)
  // stick in user table

  const attributeEmail = new CognitoUserAttribute({
    Name: 'email',
    Value: cleanEmail
  })

  await registerCognito(cleanEmail, cleanPassword, [attributeEmail])
    .then(async (res) => {
       await createNewUserSession(res.userSub, cleanEmail, cleanName, 'cognito').catch(
        (e) => {
          logger.error(e)
          status = 400
        }
      )
    })
    .catch((err) => {
      logger.error(err)
      status = 400
    })

  return NextResponse.json({ emailAddress: cleanEmail }, { status: status })
}
