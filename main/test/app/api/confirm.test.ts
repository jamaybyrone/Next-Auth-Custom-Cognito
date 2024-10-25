/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '../../../src/app/api/confirm/route'

const mockGetCookies = jest.fn()
const mockConfirmCode = jest.fn()

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn(),
  CognitoUser: jest.fn().mockImplementation(() => ({
    confirmRegistration: jest
      .fn()
      .mockImplementation((code, bool, callback) =>
        mockConfirmCode(code, bool, callback)
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
  passConfirmCode: boolean
}

interface ParamType {
  emailAddress: string
  code: string
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
      passConfirmCode: false
    },
    params: {
      emailAddress: 'test@test.com',
      code: '1234'
    },
    statusCode: 401
  },
  {
    scenario: 'if there is invalid query data',
    config: {
      hasSession: true,
      passConfirmCode: false
    },
    params: {
      emailAddress: 'testtest.com',
      code: '1234'
    },
    statusCode: 400
  },
  {
    scenario: 'if cognito fails',
    config: {
      hasSession: true,
      passConfirmCode: false
    },
    params: {
      emailAddress: 'test@test.com',
      code: '1234'
    },
    statusCode: 400
  },
  {
    scenario: 'for a successful confirm',
    config: {
      hasSession: true,
      passConfirmCode: true
    },
    params: {
      emailAddress: 'test@test.com',
      code: '1234'
    },
    statusCode: 200
  }
]

const setup = async (params: ParamType, config: ConfigType) => {
  const { hasSession, passConfirmCode } = config
  const session = hasSession ? '24124214121' : null
  mockGetCookies.mockReturnValue({ value: session })

  mockConfirmCode.mockImplementation((code, bool, callback) => {
    if (!passConfirmCode) {
      callback('kaboom', null)
    }
    callback(null, '')
  })

  const req = {
    json: jest.fn().mockResolvedValue(params)
  }

  return await POST(req as unknown as NextRequest)
}

describe('/api/confirm', () => {
  it.each(testCases)(
    'should return status code $statusCode $scenario',
    async ({ params, statusCode, config }) => {
      const { passConfirmCode } = config
      const response = await setup(params, config)
      expect(response.status).toBe(statusCode)

      if (passConfirmCode) {
        expect(mockConfirmCode).toHaveBeenCalled()
      }
    }
  )
})
