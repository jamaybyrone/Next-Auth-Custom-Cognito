import { unstable_flag as flag } from '@vercel/flags/next'

const {GITHUB_ENABLED, GOOGLE_ENABLED} = process.env

export const showGitHub = flag({
  key: 'git-hub',
  decide: () => GITHUB_ENABLED === '1'
})

export const showGoogle = flag({
  key: 'google',
  decide: () => GOOGLE_ENABLED === '1'
})
