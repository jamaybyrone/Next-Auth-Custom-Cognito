import * as yup from 'yup'
import { pageMetaType } from '@/components/meta'
import { SITE_NAME } from '@/consts/meta'

const { NEXT_PUBLIC_URL } = process.env

export const data: pageMetaType = {
  meta: {
    title: 'Confirm - ' + SITE_NAME,
    description: SITE_NAME + ' confirm your account',
    url: NEXT_PUBLIC_URL
  }
}
// yup
export const confirmYupSchema = yup.object({
  code: yup.string().required('No code provided.')
})

// formik
export const confirmFormikSchemaValues = {
  initialValues: {
    code: ''
  }
}

// fields
export const codeField = {
  label: 'Code',
  id: 'code',
  type: 'text',
  name: 'code',
  placeholder: '123456',
  fullWidth: true,
  variant: 'outlined'
}
