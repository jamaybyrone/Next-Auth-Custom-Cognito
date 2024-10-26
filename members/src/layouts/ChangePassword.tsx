'use client'

import {
  ChangePasswordParams,
  useMemberStore
} from '@/methods/hooks/store/useMemberStore'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import {
  changePasswordFormikSchemaValues,
  changePasswordYupSchema,
  existingPasswordField,
  passwordConfirmationField,
  passwordField
} from '@/app/change-password/data'
import Password from '@/components/password'
import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'

import MuiCard from '@mui/material/Card'
import { defaultCardStyle } from '@/consts/styles'

const Card = styled(MuiCard)(({ theme }) => ({ ...defaultCardStyle(theme) }))

const ChangePasswordLayout = () => {
  const { changePassword, error } = useMemberStore()

  const router = useRouter()
  const handleSubmit = (values: ChangePasswordParams) =>
    changePassword(values, router)

  const changePasswordFormik = useFormik({
    ...changePasswordFormikSchemaValues,
    validationSchema: changePasswordYupSchema,
    onSubmit: handleSubmit
  })
  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Change password
      </Typography>
      <Box
        component="form"
        onSubmit={changePasswordFormik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Password {...existingPasswordField} formik={changePasswordFormik} />
        <Password {...passwordField} formik={changePasswordFormik} />
        <Password
          {...passwordConfirmationField}
          formik={changePasswordFormik}
        />

        <Button type="submit" fullWidth variant="contained">
          Change
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
export default ChangePasswordLayout
