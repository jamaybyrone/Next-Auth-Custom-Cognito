import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FormikProps } from 'formik'

type CheckboxProps<T extends object> = {
  label: string
  id: keyof T & string
  formik: FormikProps<T>
}

export default function FormikCheckbox<T extends object>({
  formik,
  id,
  label
}: Readonly<CheckboxProps<T>>) {
  const checked = Boolean(formik.values[id])

  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          id={id}
          name={id}
          color="primary"
          checked={checked}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      }
    />
  )
}
