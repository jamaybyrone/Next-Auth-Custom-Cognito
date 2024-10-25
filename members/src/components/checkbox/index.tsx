import { default as CheckThatBox } from '@mui/material/Checkbox'
import { FormControlLabel } from '@mui/material'

interface CheckboxProps {
  label: string
  id: string
  formik: any
}
export default function Checkbox({
  formik,
  id,
  label
}: Readonly<CheckboxProps>) {
  return (
    <FormControlLabel
      control={
        <CheckThatBox
          color="primary"
          name={id}
          id={id}
          value={true}
          onChange={formik.handleChange}
        />
      }
      label={label}
    />
  )
}
