/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '../../../src/app/api/signup/route'

const mockGetCookies = jest.fn()
const mockSignUps = jest.fn()
const mockCreateUserInDynamo = jest.fn()

jest.mock('amazon-cognito-identity-js', () => ({
  CognitoUserPool: jest.fn().mockImplementation(() => ({
    signUp: jest
      .fn()
      .mockImplementation(
        (username, password, attributeList, validationData, callback) =>
          mockSignUps(
            username,
            password,
            attributeList,
            validationData,
            callback
          )
      )
  })),
  CognitoUserAttribute: jest.fn()
}))

jest.mock('../../../src/utils/dynamoDB', () => ({
  createNewUserSession: jest
    .fn()
    .mockImplementation(() => mockCreateUserInDynamo())
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockGetCookies
  }))
}))

interface ConfigType {
  hasSession: boolean
  passCognito: boolean
  passDynamo: boolean
}

interface ParamType {
  emailAddress: string
  password: string
  name: string
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
      passCognito: false,
      passDynamo: false
    },
    params: {
      emailAddress: 'test@test.com',
      password: 'tester',
      name: 'Mr Bo Jangles'
    },
    statusCode: 401
  },
  {
    scenario: 'if there is invalid post data',
    config: {
      hasSession: true,
      passCognito: false,
      passDynamo: false
    },
    params: {
      emailAddress: 'tesst.com',
      password: 'tester',
      name: 'Mr Bo Jangles'
    },
    statusCode: 400
  },
  {
    scenario: 'if cognito fails',
    config: {
      hasSession: true,
      passCognito: false,
      passDynamo: false
    },
    params: {
      emailAddress: 'test@test.com',
      password: 'tester',
      name: 'Mr Bo Jangles'
    },
    statusCode: 400
  },
  {
    scenario: 'if dynamo fails',
    config: {
      hasSession: true,
      passCognito: true,
      passDynamo: false
    },
    params: {
      emailAddress: 'test@test.com',
      password: 'tester',
      name: 'Mr Bo Jangles'
    },
    statusCode: 400
  },
  {
    scenario: 'for a successful sign up',
    config: {
      hasSession: true,
      passCognito: true,
      passDynamo: true
    },
    params: {
      emailAddress: 'test@test.com',
      password: 'tester',
      name: 'Mr Bo Jangles'
    },
    statusCode: 200
  }
]

const setup = async (params: ParamType, config: ConfigType) => {
  const { hasSession, passCognito, passDynamo } = config
  const session = hasSession ? '24124214121' : null
  mockGetCookies.mockReturnValue({ value: session })

  mockSignUps.mockImplementation(
    (username, _password, _attributeList, _validationData, callback) => {
      if (!passCognito) {
        return callback('kaboom', { user: { username } })
      }
      callback(null, { user: { username } })
    }
  )

  mockCreateUserInDynamo.mockImplementation(() => {
    return !passDynamo ? Promise.reject(new Error('kaboom')) : Promise.resolve()
  })

  const req = {
    json: jest.fn().mockResolvedValue(params)
  }

  return await POST(req as unknown as NextRequest)
}

describe('/api/signup', () => {
  it.each(testCases)(
    'should return status code $statusCode $scenario',
    async ({ params, statusCode, config }) => {
      const { passCognito, passDynamo } = config
      const response = await setup(params, config)
      expect(response.status).toBe(statusCode)

      if (passCognito) {
        const { emailAddress, password } = params
        expect(mockSignUps).toHaveBeenCalledWith(
          emailAddress,
          password,
          [{}],
          [{}],
          expect.any(Function)
        )
      }
    }
  )
})
