import { useLoginMutation, useRefreshMutation } from '@/app/api/authService'
import { useGetMeMutation } from '@/app/api/userService'
import { IFormLogin } from '@/app/login/page'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { COOKIE_NAME, HttpStatus, MESSAGE } from '../constants'
import { setUser } from '../redux/auth/authSlice'
import { useAppDispatch } from '../redux/hook'
import { useToast } from './useToast'

export const useAuth = function () {
  const dispatch = useAppDispatch()
  const [loginApi] = useLoginMutation()
  const [getUserApi] = useGetMeMutation()
  const [refreshApi] = useRefreshMutation()
  const router = useRouter()
  const toast = useToast()

  function cookieRemoveAuthInfo() {
    Cookies.remove(COOKIE_NAME.ACCESS_TOKEN)
    Cookies.remove(COOKIE_NAME.REFRESH_TOKEN)
    Cookies.remove(COOKIE_NAME.ACCESS_TOKEN_EXP)
    Cookies.remove(COOKIE_NAME.REFRESH_TOKEN_EXP)
    dispatch(setUser(null))
  }

  async function getUser() {
    try {
      const { data: res }: any = await getUserApi()
      if (res?.status === HttpStatus.OK) {
        dispatch(setUser(res.data))
        return true
      } else {
        cookieRemoveAuthInfo()
        return false
      }
    } catch (error: any) {
      cookieRemoveAuthInfo()
      return false
    }
  }

  async function login(formData: IFormLogin) {
    const { data: res }: any = await loginApi({ username: formData.username, password: formData.password })
    if (res?.status === HttpStatus.OK) {
      Cookies.set(COOKIE_NAME.ACCESS_TOKEN, res?.data.access_token)
      Cookies.set(COOKIE_NAME.REFRESH_TOKEN, res?.data.refresh_token)
      Cookies.set(COOKIE_NAME.ACCESS_TOKEN_EXP, res?.data.exp)
      Cookies.set(COOKIE_NAME.REFRESH_TOKEN_EXP, res?.data.exp_refresh)

      const statusGetUser = await getUser()
      if (statusGetUser) {
        toast.success(MESSAGE.LOGIN_SUCCESS)
        return true
      } else {
        toast.error(MESSAGE.SOMETHING_WRONG)
        return false
      }
    } else {
      toast.error(MESSAGE.SOMETHING_WRONG)
      return false
    }
  }

  function logout() {
    cookieRemoveAuthInfo()
    router.push('/login')
  }

  let isRefreshing = false

  async function refreshToken() {
    if (!isRefreshing) {
      isRefreshing = true
      const refreshToken = Cookies.get(COOKIE_NAME.REFRESH_TOKEN)
      const refreshTokenExp = parseInt(Cookies.get(COOKIE_NAME.REFRESH_TOKEN_EXP) ?? '0')
      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000)

      if (!refreshToken || refreshTokenExp < currentTimeInSeconds) {
        return false
      }
      const { data: res }: any = await refreshApi({ refresh_token: refreshToken })
      if (res?.status === HttpStatus.OK) {
        Cookies.set(COOKIE_NAME.ACCESS_TOKEN, res?.data.access_token)
        Cookies.set(COOKIE_NAME.REFRESH_TOKEN, res?.data.refresh_token)
        Cookies.set(COOKIE_NAME.ACCESS_TOKEN_EXP, res?.data.exp)
        Cookies.set(COOKIE_NAME.REFRESH_TOKEN_EXP, res?.data.exp_refresh)
        isRefreshing = false
        return true
      } else {
        isRefreshing = false
        cookieRemoveAuthInfo()
        return false
      }
    }
    return null
  }

  return {
    cookieRemoveAuthInfo,
    login,
    logout,
    getUser,
    refreshToken
  }
}
