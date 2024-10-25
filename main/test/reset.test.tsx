import '@testing-library/jest-dom'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '../src/methods/hooks/store/useAuthStore'
import { act } from 'react'
import ResetPage, { metadata } from '../src/app/reset/page'

const mockServerSession = jest.fn()
const mockRedirect = jest.fn()

jest.mock('next-auth', () => ({
  getServerSession: jest.fn().mockImplementation(() => mockServerSession())
}))
jest.mock('../src/methods/hooks/store/useAuthStore')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  redirect: jest.fn().mockImplementation((param) => mockRedirect(param))
}))

describe('Reset Meta', () => {
  it('meta data matches', () => {
    const confirmMeta = {
      description: 'Cognito Custom Auth reset your password for this website',
      metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
      openGraph: {
        description: 'Cognito Custom Auth reset your password for this website',
        images: [
          {
            height: 600,
            url: process.env.NEXT_PUBLIC_URL + '/images/backgrounds/og-1.jpg',
            width: 800
          }
        ],
        locale: 'en-gb',
        siteName: 'Cognito Custom Auth',
        title: 'Password reset - Cognito Custom Auth',
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
      title: 'Password reset - Cognito Custom Auth'
    }
    expect(metadata).toEqual(confirmMeta)
  })
})

describe('Reset Page', () => {
  const mockResetPassword = jest.fn()
  const mockResendCode = jest.fn()
  const mockSuccessMessage = 'Success!'
  const mockErrorMessage = 'Error!'
  const mockEmailAddress = 'test@example.com'

  beforeEach(() => {
    useAuthStore.mockReturnValue({
      resetPassword: mockResetPassword,
      resendCode: mockResendCode,
      error: null,
      successMessage: mockSuccessMessage,
      emailAddress: mockEmailAddress,
      loading: false
    })

    useRouter.mockReturnValue({
      push: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = async (hasSession = false) => {
    mockServerSession.mockReturnValue(hasSession)
    render(await (async () => await ResetPage())())
  }

  it('renders the component correctlye', async () => {
    await setup()

    expect(screen.getByText('Reset password')).toBeInTheDocument()
  })

  it('redirects if user has session', async () => {
    await setup(true)

    expect(mockRedirect).toHaveBeenNthCalledWith(1, '/members')
  })

  it('submits form correctly', async () => {
    await setup()
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Code'), {
        target: { value: '1234' }
      })
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password' }
      })
      fireEvent.change(screen.getByLabelText('Confirm Password'), {
        target: { value: 'password' }
      })

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    })
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalled()
    })
  })

  it('displays success message', async () => {
    await setup()

    expect(screen.getByText(mockSuccessMessage)).toBeInTheDocument()
  })

  it('displays error message when there is an error', async () => {
    useAuthStore.mockReturnValue({
      resetPassword: mockResetPassword,
      resendCode: mockResendCode,
      error: mockErrorMessage,
      successMessage: null,
      emailAddress: mockEmailAddress,
      loading: false
    })

    await setup()

    expect(screen.getByText(mockErrorMessage)).toBeInTheDocument()
  })

  it('calls resend code function', async () => {
    await setup()

    fireEvent.click(screen.getByRole('button', { name: /resend/i }))

    expect(mockResendCode).toHaveBeenCalled()
  })
})
