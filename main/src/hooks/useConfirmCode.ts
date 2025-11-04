'use client'

import { useAuthStore } from '@/hooks/store/useAuthStore'
import Log from '@/utils/logger'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { confirmCodeAction } from '@/app/actions/confirmCodeAction'

const logger = new Log('useConfirmCode')

export interface ConfirmCodeParams {
  code: string
}

export function useConfirmCode() {
  const { emailAddress, setLoading, enqueueSnackbar } = useAuthStore()
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const confirmCode = async ({ code }: ConfirmCodeParams) => {
    setLoading(true, 'Confirming your account...')
    setError('')

    try {
      const { success } = await confirmCodeAction({
        emailAddress,
        code
      })

      if (success) {
        enqueueSnackbar('Account confirmed successfully, please sign in!', {
          variant: 'success'
        })
        router.push('/sign-in')
      } else {
        setError('Invalid code, try again.')
      }
    } catch (e) {
      logger.error(e)
      setError('Network Error')
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { confirmCode, error }
}
