import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import HomePage, { metadata } from '../src/app//page'

describe('HomePage Meta', () => {
  it('meta data matches', () => {
    const HomePage = {
      description: 'Cognito Custom Auth welcome to this website',
      metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
      openGraph: {
        description: 'Cognito Custom Auth welcome to this website',
        images: [
          {
            height: 600,
            url: process.env.NEXT_PUBLIC_URL + '/images/backgrounds/og-1.jpg',
            width: 800
          }
        ],
        locale: 'en-gb',
        siteName: 'Cognito Custom Auth',
        title: 'Welcome Cognito Custom Auth',
        type: 'website',
        url: process.env.NEXT_PUBLIC_URL
      },
      robots: {
        follow: true,
        googleBot: {
          follow: true,
          index: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
          noimageindex: true
        },
        index: true,
        nocache: false
      },
      title: 'Welcome Cognito Custom Auth'
    }
    expect(metadata).toEqual(HomePage)
  })
})

describe('Home Page', () => {
  it('renders the Home Page correctly', async () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { name: /welcome/i })
    ).toBeInTheDocument()
  })
})
