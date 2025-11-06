'use client'

import Log from '@/utils/logger'
import { useAuthStore } from '@/hooks/store/useAuthStore'
import { resetPasswordAction } from '@/app/actions/resetPasswordAction'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const logger = new Log('useResetPassword')

export interface ResetPasswordParams {
  code: string
  password: string
}

export function useResetPassword() {
  const { emailAddress, setLoading, enqueueSnackbar, webSessionId } =
    useAuthStore()
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const resetPassword = async ({ code, password }: ResetPasswordParams) => {
    setLoading(true, 'Resetting your password...')
    setError('')

    try {
      const { success } = await resetPasswordAction({
        emailAddress,
        code,
        confirm_password: password
      })

      if (success) {
        enqueueSnackbar('Password reset. Please sign in!', {
          variant: 'success'
        })
        router.push('/sign-in')
      } else {
        // possible errors: LimitExceededException, CodeMismatchException, etc...
        setError('Invalid code, try again.')
      }
    } catch (e) {
      logger.error(e, webSessionId)
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { resetPassword, error }
}
