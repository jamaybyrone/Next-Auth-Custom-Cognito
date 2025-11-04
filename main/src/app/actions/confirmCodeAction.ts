'use server'

import { CognitoUser } from 'amazon-cognito-identity-js'
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'
import Log from '@/utils/logger'
import { getUserSession } from '@/methods/getUserSession'

const confirmCodeSchema = z.object({
  emailAddress: z.string().email(),
  code: z.string().min(1, 'Verification code required')
})

export async function confirmCodeAction(formData: {
  emailAddress: string
  code: string
}) {
  const webSessionId = await getUserSession()
  if (!webSessionId) {
    return { success: false, error: 'No session found' }
  }

  const logger = new Log('ConfirmAccount')

  const parsed = confirmCodeSchema.safeParse(formData)
  if (!parsed.success) {
    logger.error(parsed.error.flatten().fieldErrors, webSessionId)
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors
    }
  }

  const { emailAddress, code } = parsed.data

  const cleanEmail = DOMPurify.sanitize(emailAddress)
  const cleanCode = DOMPurify.sanitize(code)

  try {
    const user = new CognitoUser({ Username: cleanEmail, Pool: userPool })

    await new Promise((resolve, reject) =>
      user.confirmRegistration(cleanCode, true, (err, result) => {
        if (err) {reject(new Error(err.message))}
        else {resolve(result)}
      })
    )
    logger.info(`Account confirmed for ${cleanEmail}`, webSessionId)
    return { success: true, email: cleanEmail }
  } catch (error) {
    logger.error(error, webSessionId)
    return {
      success: false,
      error: error.message || 'Invalid code, please try again.'
    }
  }
}
