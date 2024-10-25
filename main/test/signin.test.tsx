import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { useAuthStore } from '../src/methods/hooks/store/useAuthStore'

import { act } from 'react'
import SignInPage, { metadata } from '../src/app/sign-in/page'

const mockUseFeatures = jest.fn()
const mockUseSearchParams = jest.fn()
const mockServerSession = jest.fn()
const mockRedirect = jest.fn()

jest.mock('../src/methods/hooks/store/useAuthStore')

jest.mock('../src/methods/featureContext', () => ({
  useFeatures: jest.fn().mockImplementation(() => mockUseFeatures())
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockImplementation(() => mockServerSession())
}))

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null
    }
  },
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation(() => mockUseSearchParams())
  }),
  redirect: jest.fn().mockImplementation((param) => mockRedirect(param))
}))

describe('Sign in Meta', () => {
  it('meta data matches', () => {
    const homeMeta = {
      description: 'Cognito Custom Auth sign in to this website',
      metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
      openGraph: {
        description: 'Cognito Custom Auth sign in to this website',
        images: [
          {
            height: 600,
            url: process.env.NEXT_PUBLIC_URL + '/images/backgrounds/og-1.jpg',
            width: 800
          }
        ],
        locale: 'en-gb',
        siteName: 'Cognito Custom Auth',
        title: 'Sign In - Cognito Custom Auth',
        type: 'website',
        url: process.env.NEXT_PUBLIC_URL
      },
      robots: {
        follow: true,
        googleBot: {
          follow: true,
          index: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
          noimageindex: true
        },
        index: true,
        nocache: false
      },
      title: 'Sign In - Cognito Custom Auth'
    }
    expect(metadata).toEqual(homeMeta)
  })
})

describe('Sign in Page', () => {
  const signInMock = jest.fn()
  const signInGoogleMock = jest.fn()
  const signInGitHubMock = jest.fn()

  beforeEach(() => {
    signInMock.mockReset()
    signInGoogleMock.mockReset()
    signInGitHubMock.mockReset()

    useAuthStore.mockReturnValue({
      signIn: signInMock,
      signInGitHub: signInGitHubMock,
      signInGoogle: signInGoogleMock,
      error: null
    })
  })

  const setup = async (
    enableGoogle = true,
    enableGithub = true,
    hasSession = false
  ) => {
    mockServerSession.mockReturnValue(hasSession)
    mockUseFeatures.mockReturnValue({
      googleEnabled: enableGoogle,
      gitHubEnabled: enableGithub
    })

    render(await (async () => await SignInPage())())
  }

  it('renders the SignIn form correctly', async () => {
    await setup()

    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument()
  })

  it('redirects if user has session', async () => {
    await setup(false, false, true)

    expect(mockRedirect).toHaveBeenNthCalledWith(1, '/members')
  })

  it('opens and closes the ForgotPassword area', async () => {
    await setup()

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Forgot your password?' })
      )
    })

    expect(
      screen.getByRole('heading', { name: /Reset password/i })
    ).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    }).then(() => {
      expect(screen.queryByText('Reset password')).not.toBeInTheDocument()
    })
  })

  it('submits the form with valid data', async () => {
    await setup()

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' }
      })

      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    })

    expect(signInMock).toHaveBeenCalledWith(
      {
        emailAddress: 'john@example.com',
        password: 'password123',
        rememberMe: false
      },
      expect.any(Object)
    )
  })

  it('displays Confirmed!, now sign in! when confirmed query passed ', async () => {
    mockUseSearchParams.mockReturnValue(true)
    await setup()

    expect(screen.getByText('Confirmed!, now sign in!')).toBeInTheDocument()
  })

  it('displays Password Reset!, now sign in! when forgot query passed ', async () => {
    mockUseSearchParams.mockReturnValueOnce(null).mockReturnValue(true)
    await setup()

    expect(
      screen.getByText('Password Reset!, now sign in!')
    ).toBeInTheDocument()
  })

  it('displays an error message when sign in fails', async () => {
    useAuthStore.mockReturnValue({
      signIn: signInMock,
      signInGitHub: signInGitHubMock,
      signInGoogle: signInGoogleMock,
      error: 'Sign in failed!'
    })

    await setup()

    expect(screen.getByText('Sign in failed!')).toBeInTheDocument()
  })

  it('should not render google when false', async () => {
    await setup(false, true)

    expect(screen.queryByText(/sign up with google/i)).not.toBeInTheDocument()
  })

  it('should not render github when false', async () => {
    await setup(true, false)

    expect(screen.queryByText(/sign up with github/i)).not.toBeInTheDocument()
  })

  it('calls the other sign in functions', async () => {
    await setup()

    fireEvent.click(
      screen.getByRole('button', { name: /sign in with google/i })
    )
    expect(signInGoogleMock).toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole('button', { name: /sign in with github/i })
    )
    expect(signInGitHubMock).toHaveBeenCalled()
  })
})
