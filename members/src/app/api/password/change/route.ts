import { NextRequest, NextResponse } from 'next/server'

import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js'

import DOMPurify from 'isomorphic-dompurify'
import { cookies } from 'next/headers'
import { sessionCookie } from '@/consts/cookie'
import Log from '@/methods/logger'
import { userPool } from '@/consts/userpool'
import { z } from 'zod'

import {getServerSession} from 'next-auth'

const schema = z.object({
  existingPassword: z.string(),
  newPassword: z.string()
})

async function changeUserPassword(email, existingPassword, newPassword) {
  const authenticationData = {
    Username: email,
    Password: existingPassword
  }

  const user = new CognitoUser({ Username: email, Pool: userPool })

  const authenticationDetails = new AuthenticationDetails(
      authenticationData
  )

  return await new Promise((resolve, reject) => user.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      user.changePassword(
          existingPassword,
          newPassword,
          function (err, result) {
            if (err) {
              alert(err.message || JSON.stringify(err))
              reject(Error(err.message))
            }
            console.log('call result: ' + result)
            resolve(result)
          }
      )

    },

    onFailure: function (err) {
      reject(Error(err.message))
    }
  }))

}

export async function POST(request: NextRequest) {
  const { value: webSessionId } = cookies().get(sessionCookie)
  if (!webSessionId) {
    return NextResponse.json({ error: 'no session' }, { status: 401 })
  }
  const logger = new Log('ChangePassword', webSessionId)
  const session = await getServerSession()
  if (!session.user) {
    logger.warn('Attempt to change password without a user session')
    return NextResponse.json({ error: 'no user session' }, { status: 401 })
  }



  const data = await request.json()
  const response = schema.safeParse(data)
  if (!response.success) {
    const { errors } = response.error
    logger.error(errors)
    return NextResponse.json({ error: errors }, { status: 400 })
  }


  const { existingPassword, newPassword } = data

  const cleanExistingPassword = DOMPurify.sanitize(existingPassword)
  const cleanNewPassword = DOMPurify.sanitize(newPassword)

  let status = 200

  await changeUserPassword(session.user.email, cleanExistingPassword, cleanNewPassword).catch((e)=>{
    logger.error(e)
    status = 400
  })






  return NextResponse.json({  }, { status: status })
}
