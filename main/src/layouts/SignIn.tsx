'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Divider from '@mui/material/Divider'

import Link from '@mui/material/Link'

import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'

import ForgotPassword from './ForgotPassword'
import GitHubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'

import Input from '@/components/input'
import Checkbox from '@/components/checkbox'
import {
  emailField,
  passwordField,
  signInFormikSchemaValues,
  signInYupSchema
} from '@/app/sign-in/data'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { SignInParams, useAuthStore } from '@/methods/hooks/store/useAuthStore'
import { useRouter, useSearchParams } from 'next/navigation'

import Password from '@/components/password'
import { useFeatures } from '@/methods/featureContext'
import { defaultCardStyle } from '@/consts/styles'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

const Card = styled(MuiCard)(({ theme }) => ({ ...defaultCardStyle(theme) }))

const confirmSuccess = 'Confirmed!, now sign in!'
const forgotSuccess = 'Password Reset!, now sign in!'

export default function SignIn() {
  const [open, setOpen] = useState<boolean>(false)
  const searchParams = useSearchParams()

  const confirmed = searchParams.get('confirmed')
  const forgot = searchParams.get('forgot')

  const {
    signIn,
    signInGitHub,
    signInGoogle,
    forgotPassword,
    error,
    emailAddress
  } = useAuthStore()

  const success = confirmed ? confirmSuccess : forgot ? forgotSuccess : ''

  const { googleEnabled, gitHubEnabled } = useFeatures()
  const router = useRouter()
  const handleSubmit = (values: SignInParams) => signIn(values, router)
  const signInFormik = useFormik({
    ...signInFormikSchemaValues(emailAddress),
    validationSchema: signInYupSchema,
    onSubmit: handleSubmit
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={signInFormik.handleSubmit as any}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <Input {...emailField} formik={signInFormik} />

        <Password {...passwordField} formik={signInFormik} />
        <Link
          component="button"
          type="button"
          onClick={handleClickOpen}
          variant="body2"
          sx={{ alignSelf: 'baseline' }}
        >
          Forgot your password?
        </Link>
        <Checkbox
          formik={signInFormik}
          id="rememberMe"
          label={'Remember me!'}
        />

        <ForgotPassword
          open={open}
          handleClose={handleClose}
          forgotPassword={forgotPassword}
        />
        <Button type="submit" fullWidth variant="contained">
          Sign in
        </Button>
        {error && (
          <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            {success}
          </Alert>
        )}

        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <span>
            <Link href="/sign-up" variant="body2" sx={{ alignSelf: 'center' }}>
              Sign up
            </Link>
          </span>
        </Typography>
      </Box>
      {(googleEnabled || gitHubEnabled) && (
        <>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {googleEnabled && (
              <Button
                fullWidth
                variant="outlined"
                onClick={signInGoogle}
                startIcon={<GoogleIcon />}
              >
                Sign in with Google
              </Button>
            )}
            {gitHubEnabled && (
              <Button
                fullWidth
                variant="outlined"
                onClick={signInGitHub}
                startIcon={<GitHubIcon />}
              >
                Sign in with Github
              </Button>
            )}
          </Box>
        </>
      )}
    </Card>
  )
}
