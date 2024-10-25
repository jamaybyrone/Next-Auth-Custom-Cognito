'use server'

import { createNewUserSession, getUserSession } from '@/utils/dynamoDB'

export const checkIfFirstSignInFromProvider = async (
  username: string,
  name: string,
  provider: string
) => {
  const userExists = await getUserSession(username)

  if (!userExists) {
    await createNewUserSession(username, name, provider)
  }
}
