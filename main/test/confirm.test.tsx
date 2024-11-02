import '@testing-library/jest-dom'
import { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { useAuthStore } from '../src/methods/hooks/store/useAuthStore'
import Confirm, { metadata } from '../src/app/confirm/page'

const mockUseSearchParams = jest.fn()
const mockServerSession = jest.fn()
const mockRedirect = jest.fn()

jest.mock('../src/methods/hooks/store/useAuthStore')
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

describe('Confirm Meta', () => {
  it('meta data matches', () => {
    const confirmMeta = {
      description: 'Cognito Custom Auth confirm your account',
      metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
      openGraph: {
        description: 'Cognito Custom Auth confirm your account',
        images: [
          {
            height: 600,
            url: undefined,
            width: 800
          }
        ],
        locale: 'en-gb',
        siteName: 'Cognito Custom Auth',
        title: 'Confirm - Cognito Custom Auth',
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
      title: 'Confirm - Cognito Custom Auth'
    }
    expect(metadata).toEqual(confirmMeta)
  })
})

describe('Confirm Component', () => {
  const confirmCodeMock = jest.fn()
  const resendCodeMock = jest.fn()
  const emailAddress = 'test@example.com'

  const setup = async (hasSession = false) => {
    mockServerSession.mockReturnValue(hasSession)
    useAuthStore.mockReturnValue({
      resendCode: resendCodeMock,
      confirmCode: confirmCodeMock,
      error: null,
      successMessage: null,
      emailAddress,
      loading: false
    })
    render(await (async () => await Confirm())())
  }

  beforeEach(() => {
    confirmCodeMock.mockReset()
    resendCodeMock.mockReset()
    useAuthStore.mockClear()
  })

  it('renders the component correctly', async () => {
    await setup()
    expect(
      screen.getByRole('heading', { name: /confirm/i })
    ).toBeInTheDocument()
  })

  it('redirects if user has session', async () => {
    await setup(true)

    expect(mockRedirect).toHaveBeenNthCalledWith(1, '/members')
  })

  it('renders the forgot query param message', async () => {
    useAuthStore.mockReturnValueOnce({
      resendCode: resendCodeMock,
      confirmCode: confirmCodeMock,
      emailAddress,
      loading: false
    })
    mockUseSearchParams.mockReturnValueOnce(true)
    await setup()
    expect(
      screen.getByText(
        'If the email test@example.com exists in our systems then a code will have been sent to the address, please enter it below:'
      )
    ).toBeInTheDocument()
  })

  it('renders the confirm query param message', async () => {
    useAuthStore.mockReturnValueOnce({
      resendCode: resendCodeMock,
      confirmCode: confirmCodeMock,
      emailAddress,
      loading: false
    })
    mockUseSearchParams.mockReturnValueOnce(null).mockReturnValue(true)
    await setup()
    expect(
      screen.getByText('Confirmation code sent to: test@example.com')
    ).toBeInTheDocument()
  })

  it('submits the form with valid code', async () => {
    await setup()
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/code/i), {
        target: { value: '123456' }
      })
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    })

    expect(confirmCodeMock).toHaveBeenCalledWith(
      { code: '123456' },
      expect.any(Object)
    )
  })

  it('displays error message when error occurs', async () => {
    useAuthStore.mockReturnValueOnce({
      resendCode: resendCodeMock,
      confirmCode: confirmCodeMock,
      error: 'Invalid confirmation code',
      successMessage: null,
      emailAddress,
      loading: false
    })

    await setup()

    expect(screen.getByText(/invalid confirmation code/i)).toBeInTheDocument()
  })

  it('displays success message when success occurs', async () => {
    useAuthStore.mockReturnValueOnce({
      resendCode: resendCodeMock,
      confirmCode: confirmCodeMock,
      error: null,
      successMessage: 'Code confirmed successfully!',
      emailAddress,
      loading: false
    })

    await setup()

    expect(
      screen.getByText(/code confirmed successfully!/i)
    ).toBeInTheDocument()
  })

  it('calls resendCode when Resend button is clicked', async () => {
    await setup()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /resend/i }))
    })

    expect(resendCodeMock).toHaveBeenCalled()
  })
})
