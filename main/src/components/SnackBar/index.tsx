'use client'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import {
  SlideUpTransition,
  SnackbarTransition
} from '@/components/SnackBar/Transistions'
import React from 'react'
import { useAuthStore } from '@/hooks/store/useAuthStore'

type SnackbarVariant = 'success' | 'error' | 'warning' | 'info'

const DEFAULT_TRANSITION: SnackbarTransition = SlideUpTransition
export interface SnackbarMessage {
  id: string
  message: string
  variant: SnackbarVariant
  transition?: SnackbarTransition
  autoHideDuration?: number
}
export const SnackBar = () => {
  const { snackbars, closeSnackbar, removeSnackbar } = useAuthStore()

  return (
    <>
      {snackbars.map((snack) => {
        const Transition = snack.transition ?? DEFAULT_TRANSITION

        return (
          <Snackbar
            key={`${snack.id}-${Transition.name}`}
            open
            onClose={(_, reason) => {
              if (reason === 'clickaway') {
                return
              }
              closeSnackbar(snack.id)
            }}
            slots={{ transition: Transition }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={snack.autoHideDuration ?? 5000}
          >
            <Alert
              onClose={() => removeSnackbar(snack.id)}
              severity={snack.variant}
              sx={{ width: '100%' }}
              variant="filled"
            >
              {snack.message}
            </Alert>
          </Snackbar>
        )
      })}
    </>
  )
}
