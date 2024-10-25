import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import React from 'react'
import {
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface PasswordProps {
  label: string
  id: string
  placeholder: string
  required?: boolean
  autoFocus?: boolean
  fullWidth: boolean
  autoComplete?: string
  formik: any
}

export default function Password({
  formik,
  id,
  autoFocus,
  required,
  fullWidth,
  placeholder,
  label,
  autoComplete
}: Readonly<PasswordProps>) {
  const hasError = formik.touched[id] && Boolean(formik.errors[id])
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  return (
    <FormControl>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <OutlinedInput
        error={hasError}
        name={id}
        placeholder={placeholder}
        id={id}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required={required}
        fullWidth={fullWidth}
        color={hasError ? 'error' : 'primary'}
        value={formik.values[id]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type={showPassword ? 'text' : 'password'}
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
      {hasError && <FormHelperText error>{formik.errors[id]}</FormHelperText>}
    </FormControl>
  )
}
