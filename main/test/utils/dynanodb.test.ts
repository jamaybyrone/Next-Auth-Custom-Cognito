import { DynamoDBDocument, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { createNewUserSession, getUserSession } from '../../src/utils/dynamoDB'

const sendMock = jest.fn()

jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocument: {
      from: jest.fn(() => ({
        send: jest.fn().mockImplementation(() => sendMock())
      }))
    },
    PutCommand: jest.fn(),
    GetCommand: jest.fn()
  }
})

describe('DynamoDB Functions', () => {
  const mockUserId = 'user123'
  const mockFullName = 'John Doe'
  const mockOrigin = 'https://example.com'
  const mockItem = {
    userid: mockUserId,
    name: mockFullName,
    origin: mockOrigin
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createNewUserSession', () => {
    it('should create a new user session', async () => {
      sendMock.mockResolvedValueOnce({})

      const result = await createNewUserSession(
        mockUserId,
        mockFullName,
        mockOrigin
      )

      expect(PutCommand).toHaveBeenCalledWith({
        TableName: process.env.DYNAMODB_USER_TABLE,
        Item: mockItem
      })
      expect(result).toEqual({})
    })

    it('should throw an error if the session creation fails', async () => {
      const errorMessage = 'Failed to create session'
      sendMock.mockRejectedValueOnce(new Error(errorMessage))

      await expect(
        createNewUserSession(mockUserId, mockFullName, mockOrigin)
      ).rejects.toThrow(errorMessage)
    })
  })

  describe('getUserSession', () => {
    it('should retrieve a user session', async () => {
      sendMock.mockResolvedValueOnce({ Item: mockItem })

      const result = await getUserSession(mockUserId)

      expect(GetCommand).toHaveBeenCalledWith({
        TableName: process.env.DYNAMODB_USER_TABLE,
        Key: {
          userid: mockUserId
        }
      })
      expect(result).toEqual(mockItem)
    })

    it('should throw an error if the session retrieval fails', async () => {
      const errorMessage = 'Failed to get session'
      sendMock.mockRejectedValueOnce(new Error(errorMessage))

      await expect(getUserSession(mockUserId)).rejects.toThrow(errorMessage)
    })
  })
})
