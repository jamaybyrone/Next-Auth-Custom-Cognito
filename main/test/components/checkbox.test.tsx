import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Formik } from 'formik'
import Checkbox from '../../src/components/checkbox'

describe('Checkbox Component', () => {
  const setup = (formikProps = {}) => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {(formik) => (
          <Checkbox
            formik={{ ...formik, ...formikProps }}
            id="test-checkbox"
            label="Test Label"
          />
        )}
      </Formik>
    )
  }

  it('renders with correct label', () => {
    setup()

    const label = screen.getByLabelText(/test label/i)
    expect(label).toBeInTheDocument()
  })

  it('calls formik.handleChange when clicked', () => {
    const handleChange = jest.fn()
    setup({ handleChange })

    const checkbox = screen.getByLabelText(/test label/i)

    fireEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalled()
  })
})
