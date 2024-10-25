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
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { ForgotPasswordParams } from '@/methods/hooks/store/useAuthStore'

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
  forgotPassword: (
    values: ForgotPasswordParams,
    router: AppRouterInstance
  ) => void
}

export default function ForgotPassword({
  open,
  handleClose,
  forgotPassword
}: Readonly<ForgotPasswordProps>) {
  const router = useRouter()
  const handleSubmit = (values: ForgotPasswordParams) => {
    forgotPassword(values, router)
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
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: forgotFormik.handleSubmit,
        noValidate: true
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
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
    </Dialog>
  )
}
