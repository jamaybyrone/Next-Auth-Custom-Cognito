'use server'

import { CognitoUser } from 'amazon-cognito-identity-js'
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'
import Log from '@/utils/logger'
import { getWebSession } from '@/methods/getWebSession'

const forgotPasswordSchema = z.object({
  forgotEmailAddress: z.email()
})

export async function forgotPasswordAction(formData: {
  forgotEmailAddress: string
}) {
  const webSessionId = await getWebSession()

  if (!webSessionId) {
    return { success: false, error: 'No session found' }
  }

  const logger = new Log('ForgotPassword')

  const parsed = forgotPasswordSchema.safeParse(formData)
  if (!parsed.success) {
    const pretty = z.prettifyError(parsed.error)

    logger.error(pretty, webSessionId)
    return {
      success: false,
      error: pretty
    }
  }

  const { forgotEmailAddress } = parsed.data

  const cleanEmail = DOMPurify.sanitize(forgotEmailAddress)

  try {
    const user = new CognitoUser({ Username: cleanEmail, Pool: userPool })
    const result = await new Promise((resolve, reject) =>
      user.forgotPassword({
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(new Error(err.message))
      })
    )

    // Cognito returns messages like “Attempt limit exceeded”
    if (JSON.stringify(result).includes('Attempt limit exceeded')) {
      logger.warn(`Attempt limit exceeded for ${cleanEmail}`, webSessionId)
      return {
        success: false,
        error: 'Attempt limit exceeded. Try again later.'
      }
    }

    logger.info(`Password reset code sent to ${cleanEmail}`, webSessionId)
    return { success: true, email: cleanEmail }
  } catch (error) {
    // security, don't say if the email doesn't exists, or if it failed...
    logger.error(error, webSessionId)
    return {
      success: true,
      email: cleanEmail,
      note: 'If that account exists, a reset link was sent.'
    }
  }
}
