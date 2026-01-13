'use server'

import { CognitoUser } from 'amazon-cognito-identity-js'
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'
import Log from '@/utils/logger'
import { getWebSession } from '@/methods/getWebSession'

const resendSchema = z.object({
  emailAddress: z.email()
})

export async function resendCodeAction(formData: { emailAddress: string }) {
  const webSessionId = await getWebSession()

  if (!webSessionId) {
    return { success: false, error: 'No session found' }
  }

  const logger = new Log('ResendCode')

  const parsed = resendSchema.safeParse(formData)
  if (!parsed.success) {
    const pretty = z.prettifyError(parsed.error)

    logger.error(pretty, webSessionId)
    return {
      success: false,
      error: pretty
    }
  }

  const { emailAddress } = parsed.data
  const cleanEmail = DOMPurify.sanitize(emailAddress)

  try {
    const user = new CognitoUser({ Username: cleanEmail, Pool: userPool })

    await new Promise((resolve, reject) =>
      user.resendConfirmationCode((err, result) => {
        if (err) {
          reject(new Error(err.message))
        } else {
          resolve(result)
        }
      })
    )
    logger.info(`Confirmation code resent to ${cleanEmail}`, webSessionId)
    return { success: true, email: cleanEmail }
  } catch (err) {
    logger.error(err, webSessionId)
    return {
      success: false,
      error: err.message || 'Failed to resend confirmation code'
    }
  }
}
