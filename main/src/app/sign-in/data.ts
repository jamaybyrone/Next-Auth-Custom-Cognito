import * as yup from 'yup'
import { pageMetaType } from '@/components/meta'
import { SITE_NAME } from '@/consts/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Sign In - ' + SITE_NAME,
    description: SITE_NAME + ' sign in to this website',
    image: `${NEXT_PUBLIC_URL}/images/backgrounds/og-1.jpg`,
    url: NEXT_PUBLIC_URL
  }
}
// yup
export const forgotYupSchema = yup.object({
  forgotEmailAddress: yup
    .string()
    .email('Enter a valid email')
    .required('No email provided.')
})
export const signInYupSchema = yup.object({
  emailAddress: yup
    .string()
    .email('Enter a valid email')
    .required('No email provided.'),
  password: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
})

// formik
export const signInFormikSchemaValues = (emailQuery: string) => {
  return {
    initialValues: {
      emailAddress: emailQuery ?? '',
      password: '',
      rememberMe: false
    }
  }
}
export const forgotPasswordFormikSchemaValues = {
  initialValues: {
    forgotEmailAddress: ''
  }
}

// fields
export const emailField = {
  label: 'Email',
  id: 'emailAddress',
  type: 'email',
  name: 'emailAddress',
  placeholder: 'your@email.com',
  autoComplete: 'email',
  require: true,
  fullWidth: true,
  variant: 'outlined'
}

export const forgotEmailAddress = {
  label: 'Email',
  id: 'forgotEmailAddress',
  type: 'email',
  name: 'forgotEmailAddress',
  placeholder: 'your@email.com',
  autoComplete: 'email',
  require: true,
  fullWidth: true,
  variant: 'outlined'
}
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
