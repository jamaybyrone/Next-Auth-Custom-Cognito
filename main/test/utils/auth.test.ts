import { CognitoUser } from 'amazon-cognito-identity-js'
import Log from '../../src/methods/logger'
import { cookies } from 'next/headers'

import { customAuth, customJWT } from '../../src/utils/auth'
import { checkIfFirstSignInFromProvider } from '../../src/methods/checkIfFirstSignInFromProvider'

jest.mock('next/headers', () => ({
  cookies: jest.fn()
}))

jest.mock('amazon-cognito-identity-js')
jest.mock('../../src/methods/logger')
jest.mock('../../src/methods/checkIfFirstSignInFromProvider')
const createMockJWT = (payload) => {
  const header = Buffer.from(
    JSON.stringify({ alg: 'none', typ: 'JWT' })
  ).toString('base64')
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64')
  return `${header}.${payloadBase64}.signature`
}

describe('Auth Module', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
  const mockCognitoUser = jest.fn()

  beforeEach(() => {
    cookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'mockSessionId' })
    })
    Log.mockImplementation(() => mockLogger)
    CognitoUser.mockImplementation(() => ({
      authenticateUser: jest.fn()
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('customAuth', () => {
    it('should authenticate user and resolve with session details and remember user', async () => {
      const credentials = {
        emailAddress: 'test@example.com',
        password: 'password123',
        rememberMe: 'true'
      }

      const mockAuthenticateUser = jest.fn((_, callbacks) => {
        const mockPayload = { sub: 'mockCognitoId', email: 'test@example.com' }
        callbacks.onSuccess({
          getIdToken: () => ({ getJwtToken: () => createMockJWT(mockPayload) }),
          getAccessToken: () => ({ getJwtToken: () => 'mockAccessToken' })
        })
      })

      CognitoUser.mockImplementationOnce(() => ({
        authenticateUser: mockAuthenticateUser
      }))

      const result = await customAuth(credentials)

      expect(result).toEqual({
        id: 'mockSessionId',
        email: 'test@example.com',
        username: expect.any(String),
        maxAge: 30 * 24 * 60 * 60
      })
    })

    it('should authenticate user and resolve with and not remember user', async () => {
      const credentials = {
        emailAddress: 'test@example.com',
        password: 'password123',
        rememberMe: 'false'
      }

      const mockAuthenticateUser = jest.fn((_, callbacks) => {
        const mockPayload = { sub: 'mockCognitoId', email: 'test@example.com' }
        callbacks.onSuccess({
          getIdToken: () => ({ getJwtToken: () => createMockJWT(mockPayload) }),
          getAccessToken: () => ({ getJwtToken: () => 'mockAccessToken' })
        })
      })

      CognitoUser.mockImplementationOnce(() => ({
        authenticateUser: mockAuthenticateUser
      }))

      const result = await customAuth(credentials)

      expect(result).toEqual({
        id: 'mockSessionId',
        email: 'test@example.com',
        username: expect.any(String),
        maxAge: 24 * 60 * 60
      })
    })

    it('should reject when no web session ID is found', async () => {
      cookies.mockReturnValue({
        get: jest.fn().mockReturnValue({ value: undefined })
      })

      const credentials = {
        emailAddress: 'test@example.com',
        password: 'password123',
        rememberMe: 'true'
      }

      await expect(customAuth(credentials)).rejects.toThrow()
    })

    it('should reject with PasswordExceeded error', async () => {
      const credentials = {
        emailAddress: 'test@example.com',
        password: 'wrongPassword',
        rememberMe: 'false'
      }

      const mockAuthenticateUser = jest.fn((_, callbacks) => {
        callbacks.onFailure({ message: 'Password attempts exceeded' })
      })

      CognitoUser.mockImplementationOnce(() => ({
        authenticateUser: mockAuthenticateUser
      }))

      await expect(customAuth(credentials)).rejects.toThrow('PasswordExceeded')
      expect(mockLogger.warn).toHaveBeenCalled()
    })

    it('should reject with UserNotConfirmed error', async () => {
      const credentials = {
        emailAddress: 'test@example.com',
        password: 'wrongPassword',
        rememberMe: 'false'
      }

      const mockAuthenticateUser = jest.fn((_, callbacks) => {
        callbacks.onFailure({ message: 'User is not confirmed.' })
      })

      CognitoUser.mockImplementationOnce(() => ({
        authenticateUser: mockAuthenticateUser
      }))

      await expect(customAuth(credentials)).rejects.toThrow('UserNotConfirmed')
    })

    it('should reject with a generic Network error', async () => {
      const credentials = {
        emailAddress: 'test@example.com',
        password: 'wrongPassword',
        rememberMe: 'false'
      }

      const mockAuthenticateUser = jest.fn((_, callbacks) => {
        callbacks.onFailure({ message: 'Some other error' })
      })

      CognitoUser.mockImplementationOnce(() => ({
        authenticateUser: mockAuthenticateUser
      }))

      await expect(customAuth(credentials)).rejects.toThrow('Network error')
    })
  })

  describe('customJWT', () => {
    it('should augment the token with user details', async () => {
      const token = {}
      const user = {
        id: 'mockUserId',
        username: 'mockUsername',
        maxAge: 3600
      }
      const account = { provider: 'github' }

      const result = await customJWT({ token, user, account })

      expect(result.sub).toBe('mockUserId')
      expect(result.username).toBe('mockUsername')
      expect(result.maxAge).toBe(3600)
      expect(result.provider).toBe('github')
    })

    it('should handle cases without user', async () => {
      const token = {}
      const result = await customJWT({ token })

      expect(result).toBe(token)
    })

    it('should check if first sign in from provider', async () => {
      const token = {}
      const user = {
        id: 'mockUserId',
        username: 'mockUsername',
        maxAge: 3600
      }
      const account = { provider: 'google' }

      jest.mock('../../src/methods/checkIfFirstSignInFromProvider', () => ({
        checkIfFirstSignInFromProvider: jest.fn()
      }))

      await customJWT({ token, user, account })

      expect(checkIfFirstSignInFromProvider).toHaveBeenCalledWith(
        user.id,
        user.id,
        undefined,
        account.provider
      )
    })
  })
})
