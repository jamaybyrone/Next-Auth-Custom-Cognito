/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '../../../src/app/api/password/reset/route'

const mockGetCookies = jest.fn()
const mockConfirmPassword = jest.fn()

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn(),
  CognitoUser: jest.fn().mockImplementation(() => ({
    confirmPassword: jest
      .fn()
      .mockImplementation((code, password, callbacks) =>
        mockConfirmPassword(code, password, callbacks)
      )
  }))
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockGetCookies
  }))
}))

interface ConfigType {
  hasSession: boolean
  passConfirm: boolean
}

interface ParamType {
  emailAddress: string
  code: string
  confirm_password: string
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
      passConfirm: false
    },
    params: {
      emailAddress: 'test@test.com',
      confirm_password: 'tester',
      code: '424141'
    },
    statusCode: 401
  },
  {
    scenario: 'if there is invalid post data',
    config: {
      hasSession: true,
      passConfirm: false
    },
    params: {
      emailAddress: 'testtest.com',
      confirm_password: 'tester',
      code: '424141'
    },
    statusCode: 400
  },
  {
    scenario: 'if cognito fails',
    config: {
      hasSession: true,
      passConfirm: false
    },
    params: {
      emailAddress: 'test@test.com',
      confirm_password: 'tester',
      code: '424141'
    },
    statusCode: 400
  },
  {
    scenario: 'for a successful confirm password',
    config: {
      hasSession: true,
      passConfirm: true
    },
    params: {
      emailAddress: 'test@test.com',
      confirm_password: 'tester',
      code: '424141'
    },
    statusCode: 200
  }
]

const setup = async (params: ParamType, config: ConfigType) => {
  const { hasSession, passConfirm } = config
  const session = hasSession ? '24124214121' : null
  mockGetCookies.mockReturnValue({ value: session })

  mockConfirmPassword.mockImplementation((code, password, callbacks) => {
    if (!passConfirm) {
      callbacks.onFailure(new Error('Kaboom'))
    }
    callbacks.onSuccess()
  })

  const req = {
    json: jest.fn().mockResolvedValue(params)
  }

  return await POST(req as unknown as NextRequest)
}

describe('/api/password/reset', () => {
  it.each(testCases)(
    'should return status code $statusCode $scenario',
    async ({ params, statusCode, config }) => {
      const { passConfirm } = config
      const response = await setup(params, config)
      expect(response.status).toBe(statusCode)

      if (passConfirm) {
        const { confirm_password, code } = params
        expect(mockConfirmPassword).toHaveBeenCalledWith(
          code,
          confirm_password,
          expect.anything()
        )
      }
    }
  )
})
