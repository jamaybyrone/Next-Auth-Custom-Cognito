import * as yup from 'yup'
import { pageMetaType } from '@/components/meta'
import { SITE_NAME } from '@/consts/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Sign Up - ' + SITE_NAME,
    description: SITE_NAME + ' sign up for this website',
    image: `${NEXT_PUBLIC_URL}/images/backgrounds/og-1.jpg`,
    url: NEXT_PUBLIC_URL
  }
}
// yup
export const SignUpYupSchema = yup.object({
  name: yup.string().required('No name provided.'),
  emailAddress: yup
    .string()
    .email('Enter a valid email')
    .required('No email provided.'),
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
export const signUpFormikSchemaValues = {
  initialValues: {
    name: '',
    emailAddress: '',
    password: '',
    passwordConfirmation: ''
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
  fullWidth: true,
  variant: 'outlined'
}
export const nameField = {
  label: 'Full name',
  id: 'name',
  type: 'text',
  name: 'name',
  placeholder: 'Jerome',
  autoComplete: 'name',
  required: true,
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
