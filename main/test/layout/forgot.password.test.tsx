import '@testing-library/jest-dom'
import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ForgotPassword from '../../src/layouts/ForgotPassword'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null
    }
  }
}))

describe('ForgotPassword Component', () => {
  const forgotPasswordMock = jest.fn()
  const handleCloseMock = jest.fn()

  const setup = (open = true) => {
    render(
      <ForgotPassword
        open={open}
        handleClose={handleCloseMock}
        forgotPassword={forgotPasswordMock}
      />
    )
  }

  beforeEach(() => {
    forgotPasswordMock.mockReset()
    handleCloseMock.mockReset()
  })

  it('renders the dialog correctly', () => {
    setup()

    expect(screen.getByText(/reset password/i)).toBeInTheDocument()
    expect(
      screen.getByText(/enter your account's email address/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /continue/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls forgotPassword and closes dialog on submit', async () => {
    setup()
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'test@example.com' }
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    })

    expect(forgotPasswordMock).toHaveBeenCalledWith(
      { forgotEmailAddress: 'test@example.com' },
      expect.any(Object)
    )
    expect(handleCloseMock).toHaveBeenCalled()
  })

  it('closes the dialog when cancel is clicked', () => {
    setup()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(handleCloseMock).toHaveBeenCalled()
  })
})
