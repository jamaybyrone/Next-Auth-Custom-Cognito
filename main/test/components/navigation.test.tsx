import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '../../src/components/navigation'
import { act } from 'react'

const setup = (session = null) => {
  render(<Navigation session={session} />)
}

const signOutMock = jest.fn()
jest.mock('next-auth/react', () => ({
  signOut: jest.fn().mockImplementation(() => signOutMock())
}))
const cogintoUser = {
  user: 'tester',
  image: undefined
}
const otherUser = {
  user: 'tester',
  image: 'alovelyPic.jpg'
}
describe('Navigation Component', () => {
  it('renders links when user is not logged in', () => {
    setup()

    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign up/i)).toBeInTheDocument()
    expect(screen.queryByText(/Members area/i)).not.toBeInTheDocument()
  })

  it('renders user menu when logged in', async () => {
    setup(cogintoUser)

    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Members area/i)).toBeInTheDocument()

    const accountButton = screen.getByRole('button', {
      name: /account of current user/i
    })
    expect(accountButton).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(accountButton)
    })

    expect(screen.getByText(/Change password/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument()
  })
  it('Calls signout when a user signs out', async () => {
    setup(cogintoUser)

    const accountButton = screen.getByRole('button', {
      name: /account of current user/i
    })
    await act(async () => {
      fireEvent.click(accountButton)
    })
    const signOutMenuItem = screen.getByText(/Sign out/i)

    await act(async () => {
      fireEvent.click(signOutMenuItem)
    })

    expect(signOutMock).toBeCalledTimes(1)
  })

  it('Change password is not visible when not cognito user', async () => {
    setup(otherUser)

    const accountButton = screen.getByRole('button', {
      name: /account of current user/i
    })
    await act(async () => {
      fireEvent.click(accountButton)
    })

    expect(screen.queryByText('Change password')).not.toBeInTheDocument()
  })
})
