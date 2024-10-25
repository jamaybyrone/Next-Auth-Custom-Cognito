import '@testing-library/jest-dom'
import Password from '../../src/components/password'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Formik } from 'formik'

describe('Password Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setup = (formikProps = {}) => {
    render(
      <Formik initialValues={{ 'test-input': '' }} onSubmit={jest.fn()}>
        {(formik) => (
          <Password
            formik={{ ...formik, ...formikProps }}
            id="password"
            label="Password Field"
            placeholder="Enter your password"
            required={true}
            fullWidth={true}
          />
        )}
      </Formik>
    )
  }

  it('renders with the correct label and placeholder', () => {
    setup()

    expect(screen.getByLabelText(/Password Field/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Enter your password/i)
    ).toBeInTheDocument()
  })

  it('calls formik.handleChange when the input value changes', () => {
    const handleChange = jest.fn()
    setup({ handleChange })

    const input = screen.getByPlaceholderText(/Enter your password/i)

    fireEvent.change(input, { target: { value: 'New Value' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('calls formik.handleBlur when the input loses focus', () => {
    const handleBlur = jest.fn()
    setup({ handleBlur })

    const input = screen.getByPlaceholderText(/Enter your password/i)

    fireEvent.blur(input)

    expect(handleBlur).toHaveBeenCalled()
  })

  it('displays error message when there is an error', () => {
    setup({
      errors: { password: 'Password is required' },
      touched: { password: true }
    })
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    setup()
    const toggleButton = screen.getByLabelText(/toggle password visibility/i)

    expect(screen.getByLabelText(/Password Field/i)).toHaveAttribute(
      'type',
      'password'
    )

    fireEvent.click(toggleButton)
    expect(screen.getByLabelText(/Password Field/i)).toHaveAttribute(
      'type',
      'text'
    )

    fireEvent.click(toggleButton)
    expect(screen.getByLabelText(/Password Field/i)).toHaveAttribute(
      'type',
      'password'
    )
  })
})
