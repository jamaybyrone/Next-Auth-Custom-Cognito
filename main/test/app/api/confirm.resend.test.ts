/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '../../../src/app/api/confirm/resend/route'

const mockGetCookies = jest.fn()
const mockResendConfirmationCode = jest.fn()

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn(),
  CognitoUser: jest.fn().mockImplementation(() => ({
    resendConfirmationCode: jest
      .fn()
      .mockImplementation((callback) => mockResendConfirmationCode(callback))
  }))
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockGetCookies
  }))
}))

interface ConfigType {
  hasSession: boolean
  passConfirmResend: boolean
}

interface ParamType {
  emailAddress: string
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
      passConfirmResend: false
    },
    params: {
      emailAddress: 'test@test.com'
    },
    statusCode: 401
  },
  {
    scenario: 'if there is invalid query data',
    config: {
      hasSession: true,
      passConfirmResend: false
    },
    params: {
      emailAddress: 'testtest.com'
    },
    statusCode: 400
  },
  {
    scenario: 'if cognito fails',
    config: {
      hasSession: true,
      passConfirmResend: false
    },
    params: {
      emailAddress: 'test@test.com'
    },
    statusCode: 400
  },
  {
    scenario: 'for a successful confirm',
    config: {
      hasSession: true,
      passConfirmResend: true
    },
    params: {
      emailAddress: 'test@test.com'
    },
    statusCode: 200
  }
]

const setup = async (params: ParamType, config: ConfigType) => {
  const { hasSession, passConfirmResend } = config
  const session = hasSession ? '24124214121' : null
  mockGetCookies.mockReturnValue({ value: session })

  mockResendConfirmationCode.mockImplementation((callback) => {
    if (!passConfirmResend) {
      callback('kaboom', null)
    }
    callback(null, '')
  })

  const req = {
    json: jest.fn().mockResolvedValue(params)
  }

  return await POST(req as unknown as NextRequest)
}

describe('/api/confirm/resend', () => {
  it.each(testCases)(
    'should return status code $statusCode $scenario',
    async ({ params, statusCode, config }) => {
      const { passConfirmResend } = config
      const response = await setup(params, config)
      expect(response.status).toBe(statusCode)

      if (passConfirmResend) {
        expect(mockResendConfirmationCode).toHaveBeenCalled()
      }
    }
  )
})
