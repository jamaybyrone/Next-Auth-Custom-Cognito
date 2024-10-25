import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Formik } from 'formik'
import Input from '../../src/components/input'

describe('Input Component', () => {
  const setup = (formikProps = {}) => {
    render(
      <Formik initialValues={{ 'test-input': '' }} onSubmit={jest.fn()}>
        {(formik) => (
          <Input
            formik={{ ...formik, ...formikProps }}
            id="test-input"
            label="Test Label"
            type="text"
            placeholder="Enter text"
            fullWidth={true}
          />
        )}
      </Formik>
    )
  }

  it('renders with the correct label and placeholder', () => {
    setup()

    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument()
  })

  it('displays error message when there is an error', () => {
    const errors = { 'test-input': 'Required' }
    setup({ errors, touched: { 'test-input': true } })

    const errorMessage = screen.getByText(/required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('calls formik.handleChange when the input value changes', () => {
    const handleChange = jest.fn()
    setup({ handleChange })

    const input = screen.getByPlaceholderText(/enter text/i)

    fireEvent.change(input, { target: { value: 'New Value' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('calls formik.handleBlur when the input loses focus', () => {
    const handleBlur = jest.fn()
    setup({ handleBlur })

    const input = screen.getByPlaceholderText(/enter text/i)

    fireEvent.blur(input)

    expect(handleBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'test-input'
        })
      })
    )
  })
})
