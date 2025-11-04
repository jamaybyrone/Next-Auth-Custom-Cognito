import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { userPool } from '@/consts/userpool'
import { getUserSession } from '@/methods/getUserSession'
import Log from '@/utils/logger'
import { createUIDForUser } from '@/methods/createUIDForUser'
import { upsertUserSession } from '@/methods/db/upsertUserSession'
import { getUserFromUserTable } from '@/methods/db/gerUserFromUserTable'
import { addNewUserInUserTable } from '@/methods/db/addNewUserInUserTable'


interface UserSession {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  maxAge: number
}

export const customAuth = async (credentials): Promise<UserSession> => {
  const webSessionId = await getUserSession()

  const logger = new Log('NextAuth')
  const { emailAddress, password, rememberMe } = credentials

  if (!webSessionId) {
    console.error(
      'No web session found for: ' + emailAddress + ' rejecting auth'
    )
    throw Error('No Session')
  }

  const lowerCaseEmail = emailAddress.toLowerCase()
  const user = new CognitoUser({
    Username: lowerCaseEmail,
    Pool: userPool
  })

  return await new Promise((resolve, reject) =>
    user.authenticateUser(
      new AuthenticationDetails({
        Username: lowerCaseEmail,
        Password: password
      }),
      {
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken()
          const deCodedToken = JSON.parse(
            Buffer.from(idToken.split('.')[1], 'base64').toString()
          )

          const cognitoId = deCodedToken.sub

          resolve({
            id: cognitoId,
            email: lowerCaseEmail,
            maxAge: rememberMe === 'true' ? 30 * 24 * 60 * 60 : 24 * 60 * 60
          })
        },
        onFailure: (err) => {
          if (err.message === 'Password attempts exceeded') {
            logger.warn(
              ' password attempted exceeded for ' + lowerCaseEmail,
              webSessionId
            )
            // maybe notify the user that someone has attempted to possibly compromise?
            reject(new Error('PasswordExceeded'))
          }
          if (err.message === 'User is not confirmed.') {
            reject(new Error('UserNotConfirmed'))
          }
          logger.error(err, webSessionId)
          reject(new Error('Network error'))
        }
      }
    )
  )
}

export const customJWT = async ({ token, user, account }) => {
  const provider = account?.provider
  if (user) {
    let uid, name, email
    const webSessionId = await getUserSession()
    if (provider !== 'credentials') {
      uid = createUIDForUser(user.email ?? user.username, provider)
      name = user['name']
      email = user['email'] ?? user['id']
    }

    const userRecord = await getUserFromUserTable(uid ?? user.id, webSessionId)
    if (!userRecord && provider !== 'credentials') {
      // first time in from provider
      await addNewUserInUserTable(uid, email, name, provider, webSessionId)
    } else if (!userRecord) {
      throw 'user does not exist in Users table'
    }

    await upsertUserSession(userRecord.id, webSessionId)

    token.sub = user.id
    token['username'] = user['username']
    token['maxAge'] = user['maxAge']
    token['provider'] = provider
  }
  return token
}
