/**
 * @jest-environment node
 */
import { checkIfFirstSignInFromProvider } from '../../src/methods/checkIfFirstSignInFromProvider'
const mockGetUserSession = jest.fn()
const mockCreateNewUserSession = jest.fn()

jest.mock('../../src/utils/dynamoDB', () => ({
  getUserSession: jest.fn().mockImplementation(() => mockGetUserSession()),
  createNewUserSession: jest
    .fn()
    .mockImplementation(() => mockCreateNewUserSession())
}))

interface TestCasesType {
  scenario: string
  username: string
  name: string
  provider: string
}

const testCases: TestCasesType[] = [
  {
    scenario: 'Should call createNewUserSession',
    username: 'test@test.com',
    name: 'Jamie',
    provider: 'github'
  },
  {
    scenario: 'Should not call createNewUserSession',
    username: 'IExist@test.com',
    name: 'Jamie',
    provider: 'github'
  }
]

const setup = async (
  userExists: boolean,
  username: string,
  name: string,
  provider: string
) => {
  if (userExists) {
    mockGetUserSession.mockReturnValue({ user: username })
  }
  await checkIfFirstSignInFromProvider(username, name, provider)
}

describe('/methods/checkIfFirstSignInFromProvider', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it.each(testCases)('$scenario', async ({ username, name, provider }) => {
    const userExists = username.includes('IExist')

    await setup(userExists, username, name, provider).then(() => {
      if (!userExists) {
        expect(mockCreateNewUserSession).toHaveBeenCalledTimes(1)
      } else {
        expect(mockCreateNewUserSession).toHaveBeenCalledTimes(0)
      }
    })
  })
})
