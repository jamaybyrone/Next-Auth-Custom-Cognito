import * as React from 'react'
import Slide, { SlideProps } from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

export type SnackbarTransition = React.ComponentType<
  TransitionProps & { children: React.ReactElement }
>

export function SlideUpTransition(props: Readonly<SlideProps>) {
  return <Slide {...props} direction="up" />
}
