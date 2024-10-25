import { create } from 'zustand'
import { signIn, SignInResponse } from 'next-auth/react'
import Log from '@/methods/logger'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface AuthState {
  emailAddress: string
  successMessage: string | undefined
  error: string | undefined
  loading: boolean
  loadingStatus: string | undefined

  signInGoogle: () => void
  signInGitHub: () => void
  signIn: (object: SignInParams, router: AppRouterInstance) => void
  forgotPassword: (
    object: ForgotPasswordParams,
    router: AppRouterInstance
  ) => void
  resetPassword: (
    object: ResetPasswordParams,
    router: AppRouterInstance
  ) => void
  resendCode: () => void
  confirmCode: (object: ConfirmCodeParams, router: AppRouterInstance) => void
  signUp: (object: SignUpParams, router: AppRouterInstance) => void
}
export interface ForgotPasswordParams {
  forgotEmailAddress: string
}
export interface ResetPasswordParams {
  code: string
  password: string
  passwordConfirmation: string
}

export interface ConfirmCodeParams {
  code: string
}

export interface SignInParams {
  emailAddress: string
  password: string
  rememberMe: boolean
}
export interface SignUpParams {
  emailAddress: string
  password: string
  passwordConfirmation: string
  name: string
}

const logger = new Log('authStore')

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      emailAddress: '',
      successMessage: undefined,
      error: undefined,
      loading: false,
      loadingStatus: undefined,

      signInGoogle: () => {
        set({
          loading: true,
          loadingStatus: 'Signing you in...',
          error: undefined,
          successMessage: undefined
        })
        signIn('google', { callbackUrl: '/members' }).catch((e) => {
          set({
            loading: false,
            error: 'Network Error',
            successMessage: undefined
          })
          logger.error(e)
        })
      },
      signInGitHub: () => {
        set({
          loading: true,
          loadingStatus: 'Signing you in...',
          error: undefined,
          successMessage: undefined
        })
        signIn('github', { callbackUrl: '/members' }).catch((e) => {
          set({
            loading: false,
            error: 'Network Error',
            successMessage: undefined
          })
          logger.error(e)
        })
      },

      signIn: (values, router) => {
        const { emailAddress, password, rememberMe } = values
        set({
          loading: true,
          loadingStatus: 'Signing you in...',
          error: undefined,
          successMessage: undefined
        })

        signIn('credentials', {
          emailAddress: emailAddress,
          password: password,
          rememberMe: rememberMe,
          redirect: false
        })
          .then((response) => {
            const { error, ok } = response as unknown as SignInResponse

            if (!ok) {
              if (error?.includes('UserNotConfirmed')) {
                fetch('/api/confirm/resend', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ emailAddress })
                }).then(() => {
                  router.push('/confirm?emailAddress')
                  set({
                    loading: false,
                    emailAddress: emailAddress,
                    successMessage:
                      'Looks like you never confirmed your account, A confirmation code has been sent to:' +
                      emailAddress
                  })
                })
              } else if (error?.includes('PasswordExceeded')) {
                logger.warn('PasswordExceeded for ' + emailAddress)
                set({
                  loading: false,
                  error: 'Your account is locked out, try again later'
                })
              } else {
                set({
                  loading: false,
                  error: 'Incorrect username or password'
                })
              }
            } else {
              set({
                loadingStatus: 'Huzzahh, redirecting you now...'
              })
              window.location.href = '/members'
            }
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      },
      forgotPassword: ({ forgotEmailAddress }, router) => {
        set({
          emailAddress: forgotEmailAddress,
          loading: true,
          loadingStatus: 'triggering a reset password...',
          error: undefined,
          successMessage: undefined
        })
        fetch('/api/password/forgot?forgotEmailAddress=' + forgotEmailAddress)
          .then(() => {
            router.push('/reset?forgot=true')
            set({
              loading: false,
              loadingStatus: undefined
            })
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      },
      resendCode: () => {
        const emailAddress = get().emailAddress
        set({
          loading: true,
          loadingStatus: 'resending... again...',
          error: undefined,
          successMessage: undefined
        })
        fetch('/api/confirm/resend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ emailAddress })
        })
          .then(() => {
            set({
              loading: false,
              successMessage: 'resent code to... ' + emailAddress
            })
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      },
      resetPassword: ({ code, password }, router) => {
        const emailAddress = get().emailAddress
        fetch('/api/password/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailAddress,
            code,
            confirm_password: password
          })
        })
          .then((response) => {
            const { ok } = response
            if (!ok) {
              set({
                loading: false,
                error: 'invalid code, try again',
                successMessage: undefined
              })
            } else {
              router.push('/sign-in/?forgot=true')
              set({
                error: '',
                loading: false
              })
            }
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      },

      confirmCode: ({ code }, router) => {
        const emailAddress = get().emailAddress
        set({
          loading: true,
          loadingStatus: 'confirming...',
          error: undefined,
          successMessage: undefined
        })
        fetch('/api/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ emailAddress, code })
        })
          .then((response) => {
            const { ok } = response
            if (!ok) {
              set({
                loading: false,
                error: 'invalid code, try again',
                successMessage: undefined
              })
            } else {
              router.push('/sign-in?confirmed=true')
              set({
                error: '',
                loading: false
              })
            }
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      },
      signUp: ({ emailAddress, password, name }, router) => {
        set({
          emailAddress: emailAddress,
          loading: true,
          loadingStatus: 'signing up now...',
          error: undefined,
          successMessage: undefined
        })
        fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ emailAddress, password, name })
        })
          .then((response) => {
            if (response.ok) {
              router.push('/confirm?signup=true')
              set({
                loading: false
              })
            } else {
              set({
                loading: false,
                error: emailAddress + ' may already be in use',
                successMessage: undefined
              })
            }
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      }
    }),
    {
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !['successMessage', 'error', 'loading', 'loadingStatus'].includes(
                key
              )
          )
        ),
      name: 'auth-data',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
