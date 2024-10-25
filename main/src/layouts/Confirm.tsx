'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import Input from '@/components/input'

import {
  ConfirmCodeParams,
  useAuthStore
} from '@/methods/hooks/store/useAuthStore'
import { useRouter, useSearchParams } from 'next/navigation'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import {
  codeField,
  confirmFormikSchemaValues,
  confirmYupSchema
} from '@/app/confirm/data'
import CheckIcon from '@mui/icons-material/Check'
import { defaultCardStyle } from '@/consts/styles'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

const Card = styled(MuiCard)(({ theme }) => ({ ...defaultCardStyle(theme) }))

export default function Confirm() {
  const {
    resendCode,
    confirmCode,
    error,
    successMessage,
    emailAddress,
    loading
  } = useAuthStore()
  const searchParams = useSearchParams()

  const forgot = searchParams.get('forgot')
  const signUp = searchParams.get('signup')
  const forgotSuccess = forgot
    ? 'If the email ' +
      emailAddress +
      ' exists in our systems then a code will have been sent to the address, please enter it below:'
    : undefined
  const signUpSuccess = signUp
    ? 'Confirmation code sent to: ' + emailAddress
    : undefined

  // successMessage is priority, then signup then forgot
  const paramMessage = forgotSuccess ?? signUpSuccess

  const success = successMessage ?? paramMessage

  const router = useRouter()
  const handleSubmit = (values: ConfirmCodeParams) =>
    confirmCode(values, router)

  const confirmFormik = useFormik({
    ...confirmFormikSchemaValues,
    validationSchema: confirmYupSchema,
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
        Confirm
      </Typography>
      <Box
        component="form"
        onSubmit={confirmFormik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Input {...codeField} formik={confirmFormik} />

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
