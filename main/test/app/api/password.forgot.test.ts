/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { GET } from '../../../src/app/api/password/forgot/route'
import { forgotEmailAddress } from '../../../src/app/data'

const mockGetCookies = jest.fn()
const mockForgotPassword = jest.fn()

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn(),
  CognitoUser: jest.fn().mockImplementation(() => ({
    forgotPassword: jest
      .fn()
      .mockImplementation((callbacks) => mockForgotPassword(callbacks))
  }))
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockGetCookies
  }))
}))

interface ConfigType {
  hasSession: boolean
  passForgot: boolean
  exceeded: boolean
}

interface ParamType {
  forgotEmailAddress: string
}

interface TestCasesType {
  scenario: string
  config: ConfigType
  params: ParamType
  statusCode: Number
}

const testCases: TestCasesType[] = [
  {
    scenario: 'if there is no session',
    config: {
      hasSession: false,
      passForgot: false,
      exceeded: false
    },
    params: {
      forgotEmailAddress: 'test@test.com'
    },
    statusCode: 401
  },
  {
    scenario: 'if there is invalid query data',
    config: {
      hasSession: true,
      passForgot: false,
      exceeded: false
    },
    params: {
      forgotEmailAddress: 'testtest.com'
    },
    statusCode: 400
  },
  {
    scenario: 'if cognito fails, for security',
    config: {
      hasSession: true,
      passForgot: false,
      exceeded: false
    },
    params: {
      forgotEmailAddress: 'test@test.com'
    },
    statusCode: 200
  },
  {
    scenario: 'for account exceeded requests',
    config: {
      hasSession: true,
      passForgot: true,
      exceeded: true
    },
    params: {
      forgotEmailAddress: 'test@test.com'
    },
    statusCode: 400
  },
  {
    scenario: 'for a successful forgot password',
    config: {
      hasSession: true,
      passForgot: true,
      exceeded: false
    },
    params: {
      forgotEmailAddress: 'test@test.com'
    },
    statusCode: 200
  }
]

const setup = async (params: ParamType, config: ConfigType) => {
  const { hasSession, passForgot, exceeded } = config
  const session = hasSession ? '24124214121' : null
  mockGetCookies.mockReturnValue({ value: session })

  mockForgotPassword.mockImplementation((callbacks) => {
    if (!passForgot) {
      callbacks.onFailure(new Error('Kaboom'))
    }
    callbacks.onSuccess(exceeded ? 'Attempt limit exceeded' : undefined)
  })

  const req = {
    nextUrl: {
      searchParams: new URLSearchParams(params as unknown as URLSearchParams)
    }
  }

  return await GET(req as unknown as NextRequest)
}

describe('/api/password/forgot', () => {
  it.each(testCases)(
    'should return status code $statusCode $scenario',
    async ({ params, statusCode, config }) => {
      const { passForgot } = config
      const response = await setup(params, config)
      expect(response.status).toBe(statusCode)

      if (passForgot) {
        expect(mockForgotPassword).toHaveBeenCalled()
      }
    }
  )
})
