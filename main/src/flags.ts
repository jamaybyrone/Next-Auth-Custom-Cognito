import { unstable_flag as flag } from '@vercel/flags/next'

export const showGitHub = flag({
  key: 'git-hub',
  decide: () => process.env.GITHUB_ENABLED === '1'
})

export const showGoogle = flag({
  key: 'google',
  decide: () => process.env.GOOGLE_ENABLED === '1'
})
