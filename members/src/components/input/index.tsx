import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import { FormikProps } from 'formik'

type InputProps<T extends object> = {
  label: string
  id: string
  type: string
  placeholder?: string
  required?: boolean
  fullWidth?: boolean
  autoComplete?: string
  formik: FormikProps<T>
}

export default function Input<T extends object>({
  formik,
  id,
  required,
  fullWidth,
  placeholder,
  type,
  label,
  autoComplete
}: Readonly<InputProps<T>>) {
  const hasError = formik.touched[id] && Boolean(formik.errors[id])
  const helperText =
    formik.touched[id] && formik.errors[id]
      ? String(formik.errors[id])
      : undefined
  return (
    <FormControl>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <TextField
        error={hasError}
        helperText={helperText}
        name={id}
        placeholder={placeholder}
        type={type}
        id={id}
        autoComplete={autoComplete}
        required={required}
        fullWidth={fullWidth}
        variant="outlined"
        color={hasError ? 'error' : 'primary'}
        value={formik.values[id]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    </FormControl>
  )
}
