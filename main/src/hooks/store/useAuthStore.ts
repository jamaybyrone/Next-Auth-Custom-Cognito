import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'
import { sessionCookie } from '@/consts/cookie'
import { SnackbarMessage } from '@/components/SnackBar'

export interface AuthState {
  webSessionId: string
  loading: boolean
  loadingStatus?: string
  emailAddress: string
  setLoading: (loading: boolean, status?: string) => void
  setEmailAddress: (email: string) => void
  snackbars: SnackbarMessage[]
  enqueueSnackbar: (
    message: string,
    options?: Partial<Omit<SnackbarMessage, 'id' | 'message'>>
  ) => void
  closeSnackbar: (id: string) => void
  removeSnackbar: (id: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  webSessionId: Cookies.get(sessionCookie),
  loading: false,
  loadingStatus: undefined,
  snackbars: [],
  emailAddress: '',
  setEmailAddress: (emailAddress) => set({ emailAddress }),

  enqueueSnackbar: (message, options = {}) =>
    set((state) => ({
      snackbars: [
        ...state.snackbars,
        {
          id: uuidv4(),
          message,
          variant: options.variant ?? 'info',
          transition: options.transition,
          autoHideDuration: options.autoHideDuration
        }
      ]
    })),

  closeSnackbar: (id) =>
    set((state) => ({
      snackbars: state.snackbars.filter((s) => s.id !== id)
    })),

  removeSnackbar: (id) =>
    set((state) => ({
      snackbars: state.snackbars.filter((s) => s.id !== id)
    })),

  setLoading: (loading, loadingStatus) => set({ loading, loadingStatus })
}))
