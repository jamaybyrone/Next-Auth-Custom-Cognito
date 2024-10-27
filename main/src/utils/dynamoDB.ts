import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

const { DYNAMODB_USER_TABLE, DYNAMODB_ACCESS_KEY_ID, DYNAMODB_SECRET_ACCESS_KEY } = process.env
const awsCredetnials = {
  accessKeyId: DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY
}

const dynamoConfig = {
  region: 'eu-west-1',
  credentials: awsCredetnials
} as {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  region: string
}

const db = DynamoDBDocument.from(new DynamoDB(dynamoConfig), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false
  }
})

export const createNewUserSession = async (
  userid: string,
  email: string,
  name: string,
  origin: string
) => {
  const command = new PutCommand({
    TableName: DYNAMODB_USER_TABLE,
    Item: {
      userid,
      name,
      email,
      origin
    }
  })
  return await db.send(command)
}

export const getUserSession = async (userid: string) => {
  const command = new GetCommand({
    TableName: DYNAMODB_USER_TABLE,
    Key: {
      userid
    }
  })

  const { Item } = await db.send(command)
  return Item
}
