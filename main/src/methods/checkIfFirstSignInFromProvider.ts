'use server'

import { createNewUserSession, getUserSession } from '@/utils/dynamoDB'

export const checkIfFirstSignInFromProvider = async (
  id: string,
  username: string,
  name: string,
  provider: string
) => {
  const userExists = await getUserSession(id)

  if (!userExists) {
    await createNewUserSession(id, username, name, provider)
  }
}
