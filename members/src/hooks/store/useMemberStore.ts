'use client'
import { v4 as uuidv4 } from 'uuid'

import Cookies from 'js-cookie'
import { create } from 'zustand'
import { sessionCookie } from '@/consts/cookie'
import { SnackbarMessage } from '@/components/SnackBar'

export interface MemberState {
  snackbars: SnackbarMessage[]
  enqueueSnackbar: (
    message: string,
    options?: Partial<Omit<SnackbarMessage, 'id' | 'message'>>
  ) => void
  closeSnackbar: (id: string) => void
  removeSnackbar: (id: string) => void
  webSessionId: string
  loading: boolean
  loadingStatus?: string
  setLoading: (loading: boolean, status?: string) => void
}

export const useMemberStore = create<MemberState>((set) => ({
  webSessionId: Cookies.get(sessionCookie),
  snackbars: [],
  loading: false,
  loadingStatus: undefined,
  setLoading: (loading, status) =>
    set({
      loading,
      loadingStatus: status ?? undefined
    }),
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
    }))
}))
