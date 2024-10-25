'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useFormik } from 'formik'
import Input from '@/components/input'
import Password from '@/components/password'
import {
  ResetPasswordParams,
  useAuthStore
} from '@/methods/hooks/store/useAuthStore'
import { useRouter } from 'next/navigation'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'

import CheckIcon from '@mui/icons-material/Check'
import {
  codeField,
  passwordField,
  passwordConfirmationField,
  resetFormikSchemaValues,
  resetYupSchema
} from '@/app/reset/data'
import { defaultCardStyle } from '@/consts/styles'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

const Card = styled(MuiCard)(({ theme }) => ({ ...defaultCardStyle(theme) }))

export default function Reset() {
  const {
    resendCode,
    resetPassword,
    error,
    successMessage,
    emailAddress,
    loading
  } = useAuthStore()

  const forgotSuccess =
    'If the email ' +
    emailAddress +
    ' exists in our systems then a code will have been sent to the address, please enter it below:'

  const success = successMessage ?? forgotSuccess

  const router = useRouter()
  const handleSubmit = (values: ResetPasswordParams) =>
    resetPassword(values, router)

  const resetFormik = useFormik({
    ...resetFormikSchemaValues,
    validationSchema: resetYupSchema,
    onSubmit: handleSubmit
  })
  return (
    <Card variant="outlined">
      {success && !error && !loading && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          {success}
        </Alert>
      )}
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
        {error && (
          <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </Card>
  )
}
