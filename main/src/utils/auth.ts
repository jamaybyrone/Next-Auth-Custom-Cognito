import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { userPool } from '@/consts/userpool'
import { checkIfFirstSignInFromProvider } from '@/methods/checkIfFirstSignInFromProvider'

interface UserSession {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  maxAge: number
}

export const customAuth = async (credentials): Promise<UserSession> => {
  const cookieStore = await cookies()
  const { value: webSessionId } = cookieStore.get(sessionCookie)
  const logger = new Log('NextAuth', webSessionId)
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
            id: webSessionId,
            email: lowerCaseEmail,
            username: cognitoId,
            maxAge: rememberMe === 'true' ? 30 * 24 * 60 * 60 : 24 * 60 * 60
          })
        },
        onFailure: (err) => {
          if (err.message === 'Password attempts exceeded') {
            logger.warn(' password attempted exceeded for ' + lowerCaseEmail)
            // maybe notify the user that someone has attempted to possibly compromise?
            reject(new Error('PasswordExceeded'))
          }
          if (err.message === 'User is not confirmed.') {
            reject(new Error('UserNotConfirmed'))
          }
          logger.error(err)
          reject(new Error('Network error'))
        }
      }
    )
  )
}

export const customJWT = async ({ token, user, account }) => {
  const provider = account?.provider
  if (user) {
    let name, email
    if (provider === 'github' || provider === 'google') {
      name = user['name']
      email = user['email'] ?? user['id']
      await checkIfFirstSignInFromProvider(user['id'], email, name, provider)
    }

    token.sub = user.id
    token['username'] = user['username']
    token['maxAge'] = user['maxAge']
    token['provider'] = provider
  }
  return token
}
