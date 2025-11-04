import * as React from 'react'
import Fade from '@mui/material/Fade'
import Grow, { GrowProps } from '@mui/material/Grow'
import Slide, { SlideProps } from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

export type SnackbarTransition = React.ComponentType<
  TransitionProps & { children: React.ReactElement }
>

export function SlideUpTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />
}

export function GrowTransition(props: GrowProps) {
  return <Grow {...props} />
}
export { Fade }
