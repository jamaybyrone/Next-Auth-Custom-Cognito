import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { userPool } from '@/consts/userpool'
import { getWebSession } from '@/methods/getWebSession'
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
  const webSessionId = await getWebSession()

  const logger = new Log('NextAuth')
  const { emailAddress, password, rememberMe } = credentials

  if (!webSessionId) {
    console.error(
      'No web session found for: ' + emailAddress + ' rejecting auth'
    )
    throw new Error('No Session')
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
    // NOTE the below webSession is not accurate at this level
    // Google and Github do CB's which wont be the initial user...
    const webSessionId = await getWebSession()
    if (provider !== 'credentials') {
      uid = createUIDForUser(user.email ?? user.username, provider)
      name = user['name']
      email = user['email'] ?? user['id']
    }

    let userId = await getUserFromUserTable(uid ?? user.id, webSessionId)
    if (!userId && provider !== 'credentials') {
      // first time in from provider
      userId = await addNewUserInUserTable(
        uid,
        email,
        name,
        provider,
        webSessionId
      )
    } else if (!userId) {
      console.error(
        'A Cognito user has signed in.. but they didnt exist in the users table.. did someone skip sign up?'
      )
      userId = await addNewUserInUserTable(
        user.id,
        'signup',
        'skipped',
        'cognito',
        webSessionId
      )
    }
    if (webSessionId) {
      // could be a cb from GC or GH
      await upsertUserSession(userId, webSessionId)
    }

    token['id'] = userId
    token['fullName'] = user['fullName']
    token['webSessionId'] = webSessionId
    token['provider'] = provider
    token['maxAge'] = user['maxAge']
  }
  return token
}
