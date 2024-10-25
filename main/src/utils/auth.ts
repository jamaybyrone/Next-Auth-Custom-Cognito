import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { userPool } from '@/consts/userpool'
import { User } from 'next-auth'
import { checkIfFirstSignInFromProvider } from '@/methods/checkIfFirstSignInFromProvider'

export const customAuth = async (credentials) => {
  const { value: webSessionId } = cookies().get(sessionCookie)!
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

  return (await new Promise((resolve, reject) =>
    user.authenticateUser(
      new AuthenticationDetails({
        Username: lowerCaseEmail,
        Password: password
      }),
      {
        onSuccess: async (result) => {
          const idToken = result.getIdToken().getJwtToken()
          const deCodedToken = JSON.parse(
            Buffer.from(idToken.split('.')[1], 'base64').toString()
          )

          const cognitoId = deCodedToken.sub

          // create user session
          const userSession = {
            id: webSessionId,
            email: lowerCaseEmail,
            username: cognitoId,
            rememberMe: rememberMe
          }
          logger.info(userSession)

          resolve({
            id: webSessionId,
            email: lowerCaseEmail,
            username: cognitoId,
            maxAge: rememberMe === 'true' ? 30 * 24 * 60 * 60 : 24 * 60 * 60
          })
        },
        onFailure: async (err) => {
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
  )) as unknown as Promise<User>
}


export const customJWT = async ({ token, user, account }) => {
  const provider = account?.provider
  if (user) {
    let name, email
    if (provider === 'github' || provider === 'google') {
      name = user['name']
      email = user['email'] ?? user['id']
      await checkIfFirstSignInFromProvider(email, name, provider)
    }

    token.sub = user.id
    token['username'] = user['username']
    token['maxAge'] = user['maxAge']
    token['provider'] = provider
  }
  return token
}
