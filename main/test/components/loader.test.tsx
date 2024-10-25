import '@testing-library/jest-dom'
import Loader from '../../src/components/loader'
import { render, screen } from '@testing-library/react'

const mockUseAuthStore = jest.fn()

jest.mock('../../src/methods/hooks/store/useAuthStore', () => ({
  useAuthStore: jest.fn().mockImplementation(() => mockUseAuthStore())
}))

describe('Loader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders Loader when loading is true', () => {
    mockUseAuthStore.mockReturnValue({
      loading: true,
      loadingStatus: 'Loading...'
    })

    render(<Loader />)
    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
  })

  it('does not render Loader when loading is false', () => {
    mockUseAuthStore.mockReturnValue({
      loading: false,
      loadingStatus: 'Loading...'
    })

    render(<Loader />)

    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
  })

  it('displays the correct loading status', () => {
    mockUseAuthStore.mockReturnValue({
      loading: true,
      loadingStatus: 'Please wait...'
    })

    render(<Loader />)

    expect(screen.getByText(/please wait.../i)).toBeInTheDocument()
  })
})
