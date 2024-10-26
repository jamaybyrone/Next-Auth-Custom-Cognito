import { create } from 'zustand'
import Log from '@/methods/logger'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface ChangePasswordParams {
  existingPassword: string
  newPassword: string
  passwordConfirmation: string
}
export interface MemberState {
  emailAddress: string
  successMessage: string | undefined
  error: string | undefined
  loading: boolean
  loadingStatus: string | undefined
  changePassword: (
    object: ChangePasswordParams,
    router: AppRouterInstance
  ) => void
}

const logger = new Log('memberStore')

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      emailAddress: '',
      successMessage: undefined,
      error: undefined,
      loading: false,
      loadingStatus: undefined,
      changePassword: (values, router) => {
        const { existingPassword, newPassword } = values
        set({
          loading: true,
          loadingStatus: 'Attempting to change password...',
          error: undefined,
          successMessage: undefined
        })
        fetch('/members/api/password/change', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ existingPassword, newPassword })
        })
          .then((response) => {
            if (response.ok) {
              router.push('/?change=true')
              set({
                loading: false
              })
            } else {
              set({
                loading: false,
                error: 'Existing password incorrect',
                successMessage: undefined
              })
            }
          })
          .catch((e) => {
            set({
              loading: false,
              error: 'Network Error',
              successMessage: undefined
            })
            logger.error(e)
          })
      }
    }),
    {
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !['successMessage', 'error', 'loading', 'loadingStatus'].includes(
                key
              )
          )
        ),
      name: 'members-data',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
