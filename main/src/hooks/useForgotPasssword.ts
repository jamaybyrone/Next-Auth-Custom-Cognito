'use client'

import Log from '@/utils/logger'

import { useAuthStore } from '@/hooks/store/useAuthStore'
import { forgotPasswordAction } from '@/app/actions/forgotPasswordAction'
import { useRouter } from 'next/navigation'

const logger = new Log('useForgotPassword')

export interface ForgotPasswordParams {
  forgotEmailAddress: string
}

export function useForgotPassword() {
  const { setEmailAddress, setLoading, enqueueSnackbar } = useAuthStore()
  const router = useRouter()

  const forgotPassword = async ({
    forgotEmailAddress
  }: ForgotPasswordParams) => {
    setEmailAddress(forgotEmailAddress)
    setLoading(true, 'Triggering password reset...')

    try {
      await forgotPasswordAction({ forgotEmailAddress })
      enqueueSnackbar('If an account exists you will receive an email', {
        variant: 'success'
      })
      router.push('/reset')
    } catch (e) {
      logger.error(e)
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { forgotPassword }
}
