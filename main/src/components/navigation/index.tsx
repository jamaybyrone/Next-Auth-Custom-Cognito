'use client'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { useState, MouseEvent } from 'react'
import Link from '@mui/material/Link'
import { signOut } from 'next-auth/react'
import NextLink from 'next/link'

const linkSX = { margin: 2, color: 'white' }

export type UserType = {
  id: string
  name: string
  image: string
}
interface NavigationProps {
  isLoggedIn: boolean
}
export default function Navigation({ isLoggedIn }: Readonly<NavigationProps>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSignOut = () => {
    handleClose()
    signOut()
  }

  return (
    <Box sx={{ flexGrow: 1 }} component={'header'}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link href={'/'} sx={linkSX} component={NextLink}>
              Home
            </Link>
            <>
              {isLoggedIn && (
                <Link href={'/members'} sx={linkSX} component={NextLink}>
                  Members area
                </Link>
              )}
              {!isLoggedIn && (
                <>
                  <Link href={'/sign-in'} sx={linkSX} component={NextLink}>
                    Sign in
                  </Link>
                  <Link href={'/sign-up'} sx={linkSX} component={NextLink}>
                    Sign up
                  </Link>
                </>
              )}
            </>
          </Box>
          <>
            {isLoggedIn && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {!isLoggedIn && (
                    <MenuItem>
                      <Link
                        href={'/members/change-password'}
                        component={NextLink}
                      >
                        Change password
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </div>
            )}
          </>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
