import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'

interface InputProps {
  label: string
  id: string
  type: string
  placeholder: string
  required?: boolean
  fullWidth: boolean
  autoComplete?: string
  formik: any
}

export default function Input({
  formik,
  id,

  required,
  fullWidth,
  placeholder,
  type,
  label,
  autoComplete
}: Readonly<InputProps>) {
  const hasError = formik.touched[id] && Boolean(formik.errors[id])

  return (
    <FormControl>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <TextField
        error={hasError}
        helperText={formik.touched[id] && formik.errors[id]}
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
