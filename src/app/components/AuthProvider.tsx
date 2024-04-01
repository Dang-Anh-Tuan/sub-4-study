'use client'

import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { COOKIE_NAME } from '../lib/constants'
import { useAuth } from '../lib/hooks/useAuth'
import { selectUser } from '../lib/redux/auth/authSlice'
import { useAppSelector } from '../lib/redux/hook'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectUser)
  const { getUser, refreshToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const checkExistUser = async () => {
    const authenUrls = ['/login', '/register']
    if (authenUrls.includes(pathname) || user) return

    const token = Cookies.get(COOKIE_NAME.ACCESS_TOKEN)
    const tokenExp = parseInt(Cookies.get(COOKIE_NAME.ACCESS_TOKEN_EXP) ?? '0')
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000)

    if (!token) {
      router.push('/login')
      return
    }

    if (token && tokenExp > currentTimeInSeconds) {
      if (await getUser()) {
        return
      } else {
        router.push('/login')
        return
      }
    }

    const statusRefreshToken = await refreshToken()
    if (statusRefreshToken === null) return
    if (statusRefreshToken) {
      if (await getUser()) {
        return
      } else {
        router.push('/login')
        return
      }
    }
    router.push('/login')
  }

  useEffect(() => {
    checkExistUser()
  }, [])

  return <>{children}</>
}
