import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'

import { useAuthStore } from '../src/methods/hooks/store/useAuthStore'

import { act } from 'react'
import SignUpPage, { metadata } from '../src/app/sign-up/page'

const mockUseFeatures = jest.fn()
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
  redirect: jest.fn().mockImplementation((param) => mockRedirect(param))
}))

describe('SignUp Meta', () => {
  it('meta data matches', () => {
    const signUp = {
      description: 'Cognito Custom Auth sign up for this website',
      metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
      openGraph: {
        description: 'Cognito Custom Auth sign up for this website',
        images: [
          {
            height: 600,
            url: process.env.NEXT_PUBLIC_URL + '/images/backgrounds/og-1.jpg',
            width: 800
          }
        ],
        locale: 'en-gb',
        siteName: 'Cognito Custom Auth',
        title: 'Sign Up - Cognito Custom Auth',
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
      title: 'Sign Up - Cognito Custom Auth'
    }
    expect(metadata).toEqual(signUp)
  })
})

describe('SignUp Page', () => {
  const signUpMock = jest.fn()
  const signInGoogleMock = jest.fn()
  const signInGitHubMock = jest.fn()

  beforeEach(() => {
    signUpMock.mockReset()
    signInGoogleMock.mockReset()
    signInGitHubMock.mockReset()

    useAuthStore.mockReturnValue({
      signUp: signUpMock,
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
    render(await (async () => await SignUpPage())())
  }

  it('renders the SignUp form correctly', async () => {
    await setup()

    expect(
      screen.getByRole('heading', { name: /sign up/i })
    ).toBeInTheDocument()
  })

  it('redirects if user has session', async () => {
    await setup(false, false, true)

    expect(mockRedirect).toHaveBeenNthCalledWith(1, '/members')
  })

  it('submits the form with valid data', async () => {
    await setup()

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Full name'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' }
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password123' }
      })

      fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    })

    expect(signUpMock).toHaveBeenCalledWith(
      {
        name: 'John Doe',
        emailAddress: 'john@example.com',
        password: 'password123',
        passwordConfirmation: 'password123'
      },
      expect.any(Object)
    )
  })

  it('displays an error message when sign up fails', async () => {
    useAuthStore.mockReturnValue({
      signUp: signUpMock,
      signInGitHub: signInGitHubMock,
      signInGoogle: signInGoogleMock,
      error: 'Sign up failed!'
    })

    await setup()

    expect(screen.getByText('Sign up failed!')).toBeInTheDocument()
  })

  it('should not render google when false', () => {
    setup(false, true)

    expect(screen.queryByText(/sign up with google/i)).not.toBeInTheDocument()
  })

  it('should not render github when false', () => {
    setup(true, false)

    expect(screen.queryByText(/sign up with github/i)).not.toBeInTheDocument()
  })

  it('calls the other sign in functions', async () => {
    await setup()

    fireEvent.click(
      screen.getByRole('button', { name: /sign up with google/i })
    )
    expect(signInGoogleMock).toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole('button', { name: /sign up with github/i })
    )
    expect(signInGitHubMock).toHaveBeenCalled()
  })
})
