'use client'

import { useAuthStore } from '@/hooks/store/useAuthStore'

import Log from '@/utils/logger'
import { signUpAction } from '@/app/actions/signUpAction'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const logger = new Log('useSignUp')

export interface SignUpParams {
  emailAddress: string
  password: string
  name: string
}

export function useSignUp() {
  const { setEmailAddress, setLoading, enqueueSnackbar, webSessionId } =
    useAuthStore()
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const signUp = async ({ emailAddress, password, name }: SignUpParams) => {
    setError('')
    setEmailAddress(emailAddress)
    setLoading(true, 'Signing up now...')

    try {
      const { success } = await signUpAction({ emailAddress, password, name })

      if (success) {
        enqueueSnackbar(`Confirmation code sent to ${emailAddress}`, {
          variant: 'success'
        })
        router.push('/confirm')
      } else {
        setError(`${emailAddress} may already be in use.`)
      }
    } catch (e) {
      logger.error(e, webSessionId)
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { signUp, error }
}
