'use server'

import { getServerSession } from 'next-auth'

export const getServerSideSessionFromToken = async () => {
  const options = {
    callbacks: {
      session({ token }) {
        //swapsies
        return token
      }
    }
  }
  return await getServerSession(options)
}
