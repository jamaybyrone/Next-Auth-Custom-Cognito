'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import Input from '@/components/input'

import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import {
  codeField,
  confirmFormikSchemaValues,
  confirmYupSchema
} from '@/app/confirm/data'
import { defaultCardStyle } from '@/consts/styles'

import Card from '@mui/material/Card'
import { ConfirmCodeParams, useConfirmCode } from '@/hooks/useConfirmCode'
import { useResendCode } from '@/hooks/useResendCode'
import {  useRouter } from 'next/navigation'
import { useAuthStore } from '@/hooks/store/useAuthStore'
import { useEffect } from 'react'

export default function Confirm() {
  const { resendCode } = useResendCode()
  const { confirmCode, error } = useConfirmCode()
  const { emailAddress, enqueueSnackbar } = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    if (!emailAddress) {
      enqueueSnackbar('No email address set!', { variant: 'info' })

      router.push('/')
    }
  }, [emailAddress])

  const handleSubmit = (values: ConfirmCodeParams) => confirmCode(values)

  const confirmFormik = useFormik({
    ...confirmFormikSchemaValues,
    validationSchema: confirmYupSchema,
    onSubmit: handleSubmit
  })
  return (
    <Card variant="outlined" sx={defaultCardStyle}>
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
        <>
          {' '}
          {error && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {error}
            </Alert>
          )}
        </>
        <Button type="submit" fullWidth variant="contained">
          Confirm
        </Button>
        <Button onClick={resendCode} fullWidth variant="contained">
          Resend
        </Button>
      </Box>
    </Card>
  )
}
