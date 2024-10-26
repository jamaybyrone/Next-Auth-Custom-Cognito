import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { customAuth, customJWT } from '@/utils/auth'

const {
  NEXTAUTH_SECRET,
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env

const handler = NextAuth({
  secret: NEXTAUTH_SECRET,

  providers: [
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      checks: ['none']
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailAddress: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' }
      },
      async authorize(credentials, req) {
        return await customAuth(credentials)
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      return await customJWT({ token, user, account })
    }
  }
})

export { handler as GET, handler as POST }
