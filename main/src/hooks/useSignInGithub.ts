'use client'

import { signIn } from 'next-auth/react'
import { useAuthStore } from '@/hooks/store/useAuthStore'
import Log from '@/utils/logger'

const logger = new Log('useSignInGitHub')

export function useSignInGitHub() {
  const { setLoading, enqueueSnackbar, webSessionId } = useAuthStore()

  const signInGitHub = async () => {
    setLoading(true, 'Signing you in...')
    try {
      await signIn('github', { callbackUrl: '/members' })
    } catch (e) {
      logger.error(e, webSessionId)
      enqueueSnackbar('Network Error!', { variant: 'error' })
      setLoading(false)
    }
  }

  return { signInGitHub }
}
