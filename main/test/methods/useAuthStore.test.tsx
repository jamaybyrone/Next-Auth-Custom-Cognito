import { useAuthStore } from '../../src/methods/hooks/store/useAuthStore'
import { act } from 'react'

import { signIn } from 'next-auth/react'

jest.mock('next-auth/react')
const mockFetch = jest.spyOn(global, 'fetch')
const mockRouter = { push: jest.fn() }

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true })
  })

  it('should initialize with default state', () => {
    const state = useAuthStore.getState()
    expect(state.emailAddress).toBe('')
    expect(state.loading).toBe(false)
  })

  it.each([
    ['Google', 'google'],
    ['GitHub', 'github']
  ])('should handle %s sign-in', async (providerName, provider) => {
    signIn.mockResolvedValue({ ok: true })

    const signInFunc = useAuthStore.getState()[`signIn${providerName}`]
    await act(async () => {
      await signInFunc()
    })

    expect(signIn).toHaveBeenCalledWith(provider, { callbackUrl: '/members' })
  })

  it.each([
    ['Google', 'google'],
    ['GitHub', 'github']
  ])('should handle %s sign-in error', async (providerName, provider) => {
    signIn.mockRejectedValue(new Error('Network Error'))

    const signInFunc = useAuthStore.getState()[`signIn${providerName}`]
    await act(async () => {
      await signInFunc()
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('should handle email/password sign-in', async () => {
    signIn.mockResolvedValue({ ok: true })

    const signInFunc = useAuthStore.getState().signIn
    await act(async () => {
      await signInFunc(
        {
          emailAddress: 'test@example.com',
          password: 'password',
          rememberMe: false
        },
        mockRouter
      )
    })

    expect(signIn).toHaveBeenCalledWith('credentials', {
      emailAddress: 'test@example.com',
      password: 'password',
      rememberMe: false,
      redirect: false
    })
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('should handle network error during email/password sign-in', async () => {
    signIn.mockRejectedValue(new Error('Network Error'))

    const signInFunc = useAuthStore.getState().signIn
    await act(async () => {
      await signInFunc(
        {
          emailAddress: 'test@example.com',
          password: 'password',
          rememberMe: false
        },
        mockRouter
      )
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it.each([
    [
      'UserNotConfirmed',
      '/confirm?emailAddress',
      'Looks like you never confirmed your account, A confirmation code has been sent to:test@example.com'
    ],
    [
      'PasswordExceeded',
      'Your account is locked out, try again later',
      undefined
    ],
    ['IncorrectCredentials', 'Incorrect username or password', undefined]
  ])(
    'should handle failed sign-in: %s',
    async (error, expectedMessage, expectedSuccessMessage) => {
      signIn.mockResolvedValue({ ok: false, error })

      const signInFunc = useAuthStore.getState().signIn
      await act(async () => {
        await signInFunc(
          {
            emailAddress: 'test@example.com',
            password: 'password',
            rememberMe: false
          },
          mockRouter
        )
      })

      if (error === 'UserNotConfirmed') {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/confirm/resend',
          expect.any(Object)
        )
        expect(mockRouter.push).toHaveBeenCalledWith(expectedMessage)
        expect(useAuthStore.getState().successMessage).toBe(
          expectedSuccessMessage
        )
      } else {
        expect(mockRouter.push).not.toHaveBeenCalled()
        expect(useAuthStore.getState().error).toBe(expectedMessage)
      }
    }
  )

  it('should handle forgot password', async () => {
    const forgotPassword = useAuthStore.getState().forgotPassword
    await act(async () => {
      await forgotPassword(
        { forgotEmailAddress: 'test@example.com' },
        mockRouter
      )
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/password/forgot?forgotEmailAddress=test@example.com'
    )
    expect(mockRouter.push).toHaveBeenCalledWith('/reset?forgot=true')
  })

  it('should handle network error during forgot password', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'))
    const forgotPassword = useAuthStore.getState().forgotPassword

    await act(async () => {
      await forgotPassword({ emailAddress: 'test@example.com' }, mockRouter)
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('should reset password', async () => {
    const resetPassword = useAuthStore.getState().resetPassword
    await act(async () => {
      await resetPassword(
        { code: '123456', password: 'tester', passwordConfirmation: 'tester' },
        mockRouter
      )
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/password/reset',
      expect.any(Object)
    )
  })

  it('should handle password reset code failure', async () => {
    const resetPassword = useAuthStore.getState().resetPassword
    mockFetch.mockResolvedValueOnce({ ok: false })

    await act(async () => {
      await resetPassword(
        { code: '123456', password: 'tester', passwordConfirmation: 'tester' },
        mockRouter
      )
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/password/reset',
      expect.any(Object)
    )
    expect(useAuthStore.getState().error).toBe('invalid code, try again')
  })

  it('should handle network error during reset password', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'))
    const resetPassword = useAuthStore.getState().resetPassword

    await act(async () => {
      await resetPassword(
        { code: '123456', password: 'tester', passwordConfirmation: 'tester' },
        mockRouter
      )
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('should resend code', async () => {
    const resendCode = useAuthStore.getState().resendCode
    await act(async () => {
      await resendCode()
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/confirm/resend',
      expect.any(Object)
    )
  })

  it('should handle network error during resend code', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'))
    const resendCode = useAuthStore.getState().resendCode

    await act(async () => {
      await resendCode()
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('should confirm code successfully', async () => {
    const confirmCode = useAuthStore.getState().confirmCode
    mockFetch.mockResolvedValueOnce({ ok: true })

    await act(async () => {
      await confirmCode({ code: '123456' }, mockRouter)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/confirm', expect.any(Object))
    expect(mockRouter.push).toHaveBeenCalledWith('/sign-in?confirmed=true')
  })

  it('should handle confirm code failure', async () => {
    const confirmCode = useAuthStore.getState().confirmCode
    mockFetch.mockResolvedValueOnce({ ok: false })

    await act(async () => {
      await confirmCode({ code: '123456' }, mockRouter)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/confirm', expect.any(Object))
    expect(useAuthStore.getState().error).toBe('invalid code, try again')
  })

  it('should handle network error during confirm code', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'))
    const confirmCode = useAuthStore.getState().confirmCode

    await act(async () => {
      await confirmCode({ code: '123456' }, mockRouter)
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('should sign up', async () => {
    const signUp = useAuthStore.getState().signUp
    await act(async () => {
      await signUp(
        {
          emailAddress: 'test@example.com',
          password: 'password',
          name: 'Test User'
        },
        mockRouter
      )
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/signup', expect.any(Object))
    expect(mockRouter.push).toHaveBeenCalledWith('/confirm?signup=true')
  })

  it('should handle sign-up failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })
    const signUp = useAuthStore.getState().signUp

    await act(async () => {
      await signUp(
        {
          emailAddress: 'test@example.com',
          password: 'password',
          name: 'Test User'
        },
        mockRouter
      )
    })

    expect(useAuthStore.getState().error).toBe(
      'test@example.com may already be in use'
    )
  })

  it('should handle network error during sign up', async () => {
    mockFetch.mockRejectedValue(new Error('Network Error'))
    const signUp = useAuthStore.getState().signUp

    await act(async () => {
      await signUp(
        {
          emailAddress: 'test@example.com',
          password: 'password',
          name: 'Test User'
        },
        mockRouter
      )
    })

    expect(useAuthStore.getState().error).toBe('Network Error')
    expect(useAuthStore.getState().loading).toBe(false)
  })
})
