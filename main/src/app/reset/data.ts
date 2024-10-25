import * as yup from 'yup'
import { pageMetaType } from '@/components/meta'
import { SITE_NAME } from '@/consts/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Password reset - ' + SITE_NAME,
    description: SITE_NAME + ' reset your password for this website',
    image: `${NEXT_PUBLIC_URL}/images/backgrounds/og-1.jpg`,
    url: NEXT_PUBLIC_URL
  }
}
// yup
export const resetYupSchema = yup.object({
  code: yup.string().required('No code provided.'),
  password: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),

  passwordConfirmation: yup
    .string()
    .required('No password provided.')
    .oneOf([yup.ref('password')!], 'Passwords must match')
})

// formik
export const resetFormikSchemaValues = {
  initialValues: {
    code: '',
    password: '',
    passwordConfirmation: ''
  }
}

// fields

export const passwordField = {
  label: 'Password',
  id: 'password',
  type: 'password',
  name: 'password',
  placeholder: '••••••',
  autoComplete: 'password',
  require: true,
  fullWidth: true
}
export const passwordConfirmationField = {
  label: 'Confirm Password',
  id: 'passwordConfirmation',
  type: 'password',
  name: 'passwordConfirmation',
  placeholder: '••••••',
  autoComplete: 'password',
  require: true,
  fullWidth: true
}

export const codeField = {
  label: 'Code',
  id: 'code',
  type: 'text',
  name: 'code',
  placeholder: '123456',
  fullWidth: true,
  variant: 'outlined'
}
