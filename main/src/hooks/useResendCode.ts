'use client'

import Log from '@/utils/logger'
import { useAuthStore } from '@/hooks/store/useAuthStore'
import { resendCodeAction } from '@/app/actions/resendCode'

const logger = new Log('useResendCode')

export function useResendCode() {
  const { emailAddress, setLoading, enqueueSnackbar } = useAuthStore()

  const resendCode = async () => {
    setLoading(true, 'Resending confirmation code...')

    try {
      await resendCodeAction({ emailAddress })
      enqueueSnackbar(`Confirmation code resent to ${emailAddress}`, {
        variant: 'success'
      })
    } catch (e) {
      logger.error(e)
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { resendCode }
}
