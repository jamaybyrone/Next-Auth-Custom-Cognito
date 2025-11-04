'use server'

import { CognitoUserAttribute, ISignUpResult } from 'amazon-cognito-identity-js'
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

import Log from '@/utils/logger'
import { getUserSession } from '@/methods/getUserSession'
import { userPool } from '@/consts/userpool'
import { addNewUserInUserTable } from '@/methods/db/addNewUserInUserTable'

const signUpSchema = z.object({
  emailAddress: z.email(),
  password: z.string().min(6, 'Password too short'),
  name: z.string().min(2, 'Name too short')
})

export async function signUpAction(formData: {
  emailAddress: string
  password: string
  name: string
}) {
  const webSessionId = await getUserSession()
  if (!webSessionId) {
    return { success: false, error: 'No session found' }
  }

  const logger = new Log('SignUp')

  const parsed = signUpSchema.safeParse(formData)
  if (!parsed.success) {
    const pretty = z.prettifyError(parsed.error)

    logger.error(pretty, webSessionId)
    return { success: false, error: pretty }
  }

  const { emailAddress, password, name } = parsed.data

  const cleanEmail = DOMPurify.sanitize(emailAddress)
  const cleanPassword = DOMPurify.sanitize(password)
  const cleanName = DOMPurify.sanitize(name)

  const attributeEmail = new CognitoUserAttribute({
    Name: 'email',
    Value: cleanEmail
  })

  try {
    const result = await new Promise<ISignUpResult>((resolve, reject) => {
      userPool.signUp(
        cleanEmail,
        cleanPassword,
        [attributeEmail],
        [attributeEmail],
        (err, result) => {
          if (err) {
            reject(new Error(err.message))
          } else {
            resolve(result)
          }
        }
      )
    })
    await addNewUserInUserTable(
      result.userSub,
      cleanEmail,
      cleanName,
      'cognito',
      webSessionId
    )
    return { success: true, emailAddress: cleanEmail }
  } catch (e) {
    logger.error(e, webSessionId)
    return { success: false, error: e.message || 'Sign up failed' }
  }
}
