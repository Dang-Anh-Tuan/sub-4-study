'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import 'react-toastify/dist/ReactToastify.css' //add this line
import theme from '../theme'
import StoreProvider from './components/StoreProvider'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './components/AuthProvider'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider theme={theme}>
            <StoreProvider>
              <AuthProvider>{children}</AuthProvider>
            </StoreProvider>
          </ThemeProvider>
          <ToastContainer />
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
