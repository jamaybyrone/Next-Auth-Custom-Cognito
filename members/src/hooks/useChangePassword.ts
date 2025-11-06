'use client'

import { useMemberStore } from '@/hooks/store/useMemberStore'
import { useState } from 'react'
import { changePasswordAction } from '@/app/actions/changePasswordAction'
import Log from '@/utils/logger'

const logger = new Log('useChangePassword')

export interface ChangePasswordParams {
  existingPassword: string
  newPassword: string
  passwordConfirmation: string
}
export function useChangePassword() {
  const { setLoading, webSessionId, enqueueSnackbar } = useMemberStore()
  const [error, setError] = useState<string | null>(null)

  const changePassword = async ({
    existingPassword,
    newPassword,
    passwordConfirmation
  }: ChangePasswordParams) => {
    setError(null)

    if (newPassword !== passwordConfirmation) {
      setError('Passwords do not match')
      return
    }

    setLoading(true, 'Updating your password...')

    try {
      const result = await changePasswordAction({
        existingPassword,
        newPassword
      })

      if (!result.success) {
        logger.error(result.error, webSessionId)
        enqueueSnackbar('Password change failed!', { variant: 'error' })
        return
      }

      enqueueSnackbar('Password changed successfully!, please sign in!', {
        variant: 'success'
      })
    } catch (e) {
      logger.error(e, webSessionId)
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return {
    changePassword,
    error
  }
}
