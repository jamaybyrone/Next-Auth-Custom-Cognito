import { SITE_NAME } from '@/consts/meta'
import { pageMetaType } from '@/components/meta'
import * as yup from 'yup'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Change password -' + SITE_NAME,
    description: SITE_NAME + ' sign in to this website',
    image: `${NEXT_PUBLIC_URL}/images/backgrounds/og-1.jpg`,
    url: NEXT_PUBLIC_URL
  }
}
export const changePasswordYupSchema = yup.object({
  existingPassword: yup
    .string()
    .min(8, 'Existing password is too short - should be 8 chars minimum.')
    .required('No password provided.'),
  newPassword: yup
    .string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),

  passwordConfirmation: yup
    .string()
    .required('No password provided.')
    .oneOf([yup.ref('newPassword')!], 'Passwords must match')
})

export const changePasswordFormikSchemaValues = {
  initialValues: {
    existingPassword: '',
    newPassword: '',
    passwordConfirmation: ''
  }
}

export const existingPasswordField = {
  label: 'Existing password',
  id: 'existingPassword',
  type: 'password',
  name: 'existingPassword',
  placeholder: '••••••',
  autoComplete: 'password',
  require: true,
  fullWidth: true
}

export const passwordField = {
  label: 'New password',
  id: 'newPassword',
  type: 'password',
  name: 'newPassword',
  placeholder: '••••••',
  autoComplete: 'password',
  require: true,
  fullWidth: true
}
export const passwordConfirmationField = {
  label: 'Confirm password',
  id: 'passwordConfirmation',
  type: 'password',
  name: 'passwordConfirmation',
  placeholder: '••••••',
  autoComplete: 'password',
  require: true,
  fullWidth: true
}
