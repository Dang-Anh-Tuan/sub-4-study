'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import 'react-toastify/dist/ReactToastify.css' //add this line
import theme from '../theme'
import StoreProvider from './components/StoreProvider'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './components/AuthProvider'
import { usePathname } from 'next/navigation'
import SideBar from './components/common/SideBar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const authenUrls = ['/login', '/register', '/sub-version/create']

  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider theme={theme}>
            <StoreProvider>
              <AuthProvider>
                {authenUrls.includes(pathname) ? (
                  children
                ) : (
                  <div className='flex'>
                    <SideBar />
                    <div className='flex-1'>{children}</div>
                  </div>
                )}
              </AuthProvider>
            </StoreProvider>
          </ThemeProvider>
          <ToastContainer />
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
