import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { SnackbarTransition } from '@/components/SnackBar/Transistions'

export interface AuthState {
  loading: boolean
  loadingStatus?: string
  emailAddress: string
  setLoading: (loading: boolean, status?: string) => void
  snackbars: SnackbarMessage[]
  setEmailAddress: (email: string) => void
  enqueueSnackbar: (
    message: string,
    options?: Partial<Omit<SnackbarMessage, 'id' | 'message'>>
  ) => void
  closeSnackbar: (id: string) => void
  removeSnackbar: (id: string) => void
}
type SnackbarVariant = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarMessage {
  id: string
  message: string
  variant: SnackbarVariant
  transition?: SnackbarTransition
  autoHideDuration?: number
}
export const useAuthStore = create<AuthState>((set) => ({
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
