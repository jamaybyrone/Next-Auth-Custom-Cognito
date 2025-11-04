'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import Link from '@mui/material/Link'

import Typography from '@mui/material/Typography'

import { useFormik } from 'formik'
import Input from '@/components/input'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import {
  nameField,
  passwordConfirmationField,
  passwordField,
  emailField,
  signUpFormikSchemaValues,
  SignUpYupSchema
} from '@/app/sign-up/data'

import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import Password from '@/components/password'
import { useFeatures } from '@/providers/featureContext'
import Card from '@mui/material/Card'
import { defaultCardStyle } from '@/consts/styles'
import { SignUpParams, useSignUp } from '@/hooks/useSignUp'
import { useSignInGoogle } from '@/hooks/useSignInGoogle'
import { useSignInGitHub } from '@/hooks/useSignInGithub'

export default function SignUp() {
  const { signUp, error } = useSignUp()
  const { signInGoogle } = useSignInGoogle()
  const { signInGitHub } = useSignInGitHub()

  const { googleEnabled, gitHubEnabled } = useFeatures()
  const handleSubmit = (values: SignUpParams) => signUp(values)

  const signUpFormik = useFormik({
    ...signUpFormikSchemaValues,
    validationSchema: SignUpYupSchema,
    onSubmit: handleSubmit
  })
  return (
    <Card variant="outlined" sx={defaultCardStyle}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={signUpFormik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Input {...nameField} formik={signUpFormik} />
        <Input {...emailField} formik={signUpFormik} />
        <Password {...passwordField} formik={signUpFormik} />
        <Password {...passwordConfirmationField} formik={signUpFormik} />

        <Button type="submit" fullWidth variant="contained">
          Sign up
        </Button>
        <>
          {' '}
          {error && (
            <Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
              {error}
            </Alert>
          )}
        </>
        <Typography sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <span>
            <Link href="/sign-in" variant="body2" sx={{ alignSelf: 'center' }}>
              Sign in
            </Link>
          </span>
        </Typography>
      </Box>

      <>
        {(googleEnabled || gitHubEnabled) && (
          <>
            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <>
                {' '}
                {googleEnabled && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={signInGoogle}
                    startIcon={<GoogleIcon />}
                  >
                    Sign up with Google
                  </Button>
                )}
              </>
              <>
                {' '}
                {gitHubEnabled && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={signInGitHub}
                    startIcon={<GitHubIcon />}
                  >
                    Sign up with Github
                  </Button>
                )}
              </>
            </Box>
          </>
        )}
      </>
    </Card>
  )
}
