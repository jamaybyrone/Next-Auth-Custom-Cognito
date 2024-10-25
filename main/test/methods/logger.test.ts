/**
 * @jest-environment node
 */

import Log from '../../src/methods/logger'

const mockGetCookies = jest.fn()
const id = '124242141241'
const location = 'Test'
jest.mock('js-cookie', () => ({
  get: jest.fn().mockImplementation((cookieName) => mockGetCookies(cookieName))
}))

interface TestCasesType {
  type: 'string' | 'object'
  message: string | object
  method: 'info' | 'warn' | 'error'
  isServer: boolean
}

const testCases: TestCasesType[] = [
  {
    type: 'string',
    message: 'Howdo',
    method: 'warn',
    isServer: false
  },
  {
    type: 'string',
    message: 'Howdo',
    method: 'error',
    isServer: false
  },
  {
    type: 'string',
    message: 'Howdo',
    method: 'info',
    isServer: true
  },
  {
    type: 'string',
    message: { message: 'howdo' },
    method: 'info',
    isServer: true
  },
  {
    type: 'object',
    message: { message: 'howdo' },
    method: 'warn',
    isServer: false
  },
  {
    type: 'object',
    message: { message: 'howdo' },
    method: 'warn',
    isServer: false
  },
  {
    type: 'object',
    message: { message: 'howdo' },
    method: 'error',
    isServer: false
  },
  {
    type: 'object',
    message: { message: 'howdo' },
    method: 'info',
    isServer: false
  }
]

const setup = (
  method: 'info' | 'warn' | 'error',
  message: string | object,
  isServer: boolean
) => {
  let outputData = ''
  const storeLog = (input: string, message) => {
    outputData += input + message
  }

  console[method] = jest.fn(storeLog)

  const session = isServer ? id : undefined
  if (!isServer) {
    global.window = 'tester'
    mockGetCookies.mockImplementation((cookieName) => {
      return id
    })
  }
  const logger = new Log(location, session)

  logger[method](message)

  return outputData
}

describe('methods/logger', () => {
  it.each(testCases)(
    `should log $type of $message to $method whilst isServer is $isServer`,
    async ({ message, method, isServer }) => {
      const stringMessage =
        typeof message === 'string' ? message : JSON.stringify(message, null, 2)
      const output = setup(method, message, isServer)
      const prefix =
        'session: ' + id + ' - ' + method + ' - during ' + location + ' - '
      expect(output).toContain(prefix)
      expect(output).toContain(stringMessage)
    }
  )
})
