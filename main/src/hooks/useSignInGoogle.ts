'use client'

import { signIn } from 'next-auth/react'
import { useAuthStore } from '@/hooks/store/useAuthStore'
import Log from '@/utils/logger'

const logger = new Log('useSignInGoogle')

export function useSignInGoogle() {
  const { setLoading, enqueueSnackbar, webSessionId } = useAuthStore()

  const signInGoogle = async () => {
    setLoading(true, 'Signing you in...')
    try {
      await signIn('google', { callbackUrl: '/members' })
    } catch (e) {
      logger.error(e, webSessionId)
      enqueueSnackbar('Network Error!', { variant: 'error' })
      setLoading(false)
    }
  }

  return { signInGoogle }
}
