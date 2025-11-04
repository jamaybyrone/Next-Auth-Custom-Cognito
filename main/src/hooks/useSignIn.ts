'use client'

import { signIn } from 'next-auth/react'
import Log from '@/utils/logger'
import { useAuthStore } from '@/hooks/store/useAuthStore'
import { useState } from 'react'
import { resendCodeAction } from '@/app/actions/resendCode'
import { useRouter } from 'next/navigation'

const logger = new Log('useSignIn')

export interface SignInParams {
  emailAddress: string
  password: string
  rememberMe: boolean
}

export function useSignIn() {
  const { setLoading, setEmailAddress, enqueueSnackbar } = useAuthStore()
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const signInWithCredentials = async ({
    emailAddress,
    password,
    rememberMe
  }: SignInParams) => {
    setLoading(true, 'Signing you in...')
    setError('')

    try {
      const response = await signIn('credentials', {
        emailAddress,
        password,
        rememberMe,
        redirect: false
      })

      const { ok, error } = response

      if (!ok) {
        if (error?.includes('UserNotConfirmed')) {
          await resendCodeAction({ emailAddress })
          setEmailAddress(emailAddress)
          enqueueSnackbar(
            `Looks like you never confirmed your account. A confirmation code has been sent to ${emailAddress}.`,
            { variant: 'success' }
          )
          router.push('/confirm')
        } else if (error?.includes('PasswordExceeded')) {
          setError('Your account is locked out. Try again later.')
        } else {
          setError('Incorrect username or password.')
        }
      } else {
        setLoading(true, 'Redirecting you now...')
        window.location.href = '/members'
      }
    } catch (e) {
      logger.error(e)
      enqueueSnackbar('Network Error!', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return { signIn: signInWithCredentials, error }
}
