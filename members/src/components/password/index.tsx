import React from 'react'
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormikProps } from 'formik'

type PasswordProps<T extends object> = {
  label: string
  id: string
  placeholder?: string
  required?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  autoComplete?: string
  formik: FormikProps<T>
}

export default function Password<T extends object>({
  formik,
  id,
  autoFocus = false,
  required = false,
  fullWidth = true,
  placeholder,
  label,
  autoComplete
}: Readonly<PasswordProps<T>>) {
  const [showPassword, setShowPassword] = React.useState(false)
  const hasError = formik.touched[id] && Boolean(formik.errors[id])

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  return (
    <FormControl fullWidth={fullWidth} variant="outlined">
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <OutlinedInput
        id={id}
        name={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required={required}
        error={hasError}
        color={hasError ? 'error' : 'primary'}
        value={formik.values[id] ?? ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      {hasError && (
        <FormHelperText error>{String(formik.errors[id])}</FormHelperText>
      )}
    </FormControl>
  )
}
