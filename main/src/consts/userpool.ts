import { CognitoUserPool } from 'amazon-cognito-identity-js'

const { COGNITO_APP_CLIENT_ID, COGNITO_USER_POOL_ID } = process.env
export const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_APP_CLIENT_ID
})
