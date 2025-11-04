'use server'

import { CognitoUser } from 'amazon-cognito-identity-js'
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'
import { userPool } from '@/consts/userpool'
import Log from '@/utils/logger'
import { getUserSession } from '@/methods/getUserSession'

const resetPasswordSchema = z.object({
  emailAddress: z.string().email(),
  code: z.string().min(1, 'Verification code required'),
  confirm_password: z.string().min(6, 'Password must be at least 6 characters')
})

async function resetPassword(
  username: string,
  code: string,
  password: string
): Promise<void> {
  const user = new CognitoUser({ Username: username, Pool: userPool })

  return new Promise((resolve, reject) => {
    user.confirmPassword(code, password, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(new Error(err.message))
    })
  })
}

export async function resetPasswordAction(formData: {
  emailAddress: string
  code: string
  confirm_password: string
}) {
  const webSessionId = await getUserSession()

  if (!webSessionId) {
    return { success: false, error: 'No session found' }
  }

  const logger = new Log('ResetPassword')

  const parsed = resetPasswordSchema.safeParse(formData)
  if (!parsed.success) {
    logger.error(parsed.error.flatten().fieldErrors, webSessionId)
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors
    }
  }

  const { emailAddress, code, confirm_password } = parsed.data

  const cleanEmail = DOMPurify.sanitize(emailAddress)
  const cleanCode = DOMPurify.sanitize(code)
  const cleanPassword = DOMPurify.sanitize(confirm_password)

  try {
    await resetPassword(cleanEmail, cleanCode, cleanPassword)
    return { success: true, email: cleanEmail }
  } catch (err) {
    logger.error(err, webSessionId)
    // possible errors: LimitExceededException, CodeMismatchException, etc...
    return {
      success: false,
      error: err.message || 'Password reset failed'
    }
  }
}
