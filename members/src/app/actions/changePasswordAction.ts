'use server'

import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import DOMPurify from 'isomorphic-dompurify'
import { userPool } from '@/consts/userpool'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import Log from '@/utils/logger'
import { getWebSession } from '@/methods/getWebSession'

const schema = z.object({
  existingPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
})

export async function changePasswordAction(formData: {
  existingPassword: string
  newPassword: string
}) {
  const webSessionId = await getWebSession()
  if (!webSessionId) {
    return { success: false, error: 'No session found' }
  }

  const logger = new Log('ChangePassword')

  const session = await getServerSession()
  if (!session?.user?.email) {
    logger.warn(
      'Attempt to change password without a valid user session',
      webSessionId
    )
    return { success: false, error: 'No user session' }
  }

  const parsed = schema.safeParse(formData)
  if (!parsed.success) {
    const errors = parsed.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    )
    logger.error(errors, webSessionId)
    return { success: false, error: errors }
  }

  const { existingPassword, newPassword } = parsed.data

  const cleanExisting = DOMPurify.sanitize(existingPassword)
  const cleanNew = DOMPurify.sanitize(newPassword)

  try {
    const { email } = session.user

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: cleanExisting
    })

    const user = new CognitoUser({ Username: email, Pool: userPool })

    await new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: () => {
          user.changePassword(cleanExisting, cleanNew, (err, result) => {
            if (err) {
              logger.error(err.message, webSessionId)
              reject(new Error(err.message))
            } else {
              resolve(result)
            }
          })
        },
        onFailure: (err) => {
          logger.error(err.message, webSessionId)
          reject(new Error(err.message))
        }
      })
    })
    logger.info(`Password changed for ${session.user.email}`, webSessionId)
    return { success: true }
  } catch (err) {
    logger.error(err, webSessionId)
    return { success: false, error: err.message || 'Password change failed' }
  }
}
