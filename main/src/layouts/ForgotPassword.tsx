'use client'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { useFormik } from 'formik'
import Input from '@/components/input'
import {
  forgotEmailAddress,
  forgotPasswordFormikSchemaValues,
  forgotYupSchema
} from '@/app/sign-in/data'

import {
  ForgotPasswordParams,
  useForgotPassword
} from '@/hooks/useForgotPasssword'
import Box from '@mui/material/Box'

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

export default function ForgotPassword({
  open,
  handleClose
}: Readonly<ForgotPasswordProps>) {
  const { forgotPassword } = useForgotPassword()

  const handleSubmit = (values: ForgotPasswordParams) => {
    forgotPassword(values)
    handleClose()
  }
  const forgotFormik = useFormik({
    ...forgotPasswordFormikSchemaValues,
    validationSchema: forgotYupSchema,
    onSubmit: (val) => {
      handleSubmit(val)
    }
  })

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={forgotFormik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
          }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a
            link to reset your password.
          </DialogContentText>
          <Input
            {...forgotEmailAddress}
            label={'Email address'}
            formik={forgotFormik}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose} aria-label={'Cancel'}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Continue
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
