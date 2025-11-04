'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useFormik } from 'formik'
import Input from '@/components/input'
import Password from '@/components/password'

import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'

import {
  codeField,
  passwordField,
  passwordConfirmationField,
  resetFormikSchemaValues,
  resetYupSchema
} from '@/app/reset/data'
import { ResetPasswordParams, useResetPassword } from '@/hooks/useResetPassword'
import Card from '@mui/material/Card'
import { defaultCardStyle } from '@/consts/styles'
import { useResendCode } from '@/hooks/useResendCode'

export default function Reset() {
  const { resetPassword, error } = useResetPassword()
  const { resendCode } = useResendCode()
  const handleSubmit = (values: ResetPasswordParams) => resetPassword(values)

  const resetFormik = useFormik({
    ...resetFormikSchemaValues,
    validationSchema: resetYupSchema,
    onSubmit: handleSubmit
  })
  return (
    <Card variant="outlined" sx={defaultCardStyle}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Reset password
      </Typography>
      <Box
        component="form"
        onSubmit={resetFormik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Input {...codeField} formik={resetFormik} />
        <Password {...passwordField} formik={resetFormik} />
        <Password {...passwordConfirmationField} formik={resetFormik} />
        <Button type="submit" fullWidth variant="contained">
          Confirm
        </Button>
        <Button onClick={resendCode} fullWidth variant="contained">
          Resend
        </Button>
        <>
          {error && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {error}
            </Alert>
          )}
        </>
      </Box>
    </Card>
  )
}
