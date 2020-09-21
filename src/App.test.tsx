import React from 'react'
import { render, screen } from '@testing-library/react'
import { StoreProvider } from './store'
import App from './App'

test('renders conduit title', () => {
  render(<StoreProvider><App /></StoreProvider>)
  const linkElement = screen.getByRole('link', { name: /conduit/i })
  screen.debug(linkElement)
  expect(linkElement).toBeInTheDocument()
})
