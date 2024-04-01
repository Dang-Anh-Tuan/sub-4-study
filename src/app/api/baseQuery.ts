import { BaseQueryFn, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { COOKIE_NAME, HttpStatus } from '../lib/constants'
import Cookies from 'js-cookie'
import { FetchArgs } from '@reduxjs/toolkit/query'
import { RootState } from '../lib/redux/store'
import { setUser } from '../lib/redux/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL_PRODUCT
      : process.env.NEXT_PUBLIC_BASE_URL_DEVELOP,
  prepareHeaders: (headers) => {
    const token = Cookies.get(COOKIE_NAME.ACCESS_TOKEN)
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

let isRefreshing = false;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === HttpStatus.UNAUTHORIZED) {
    const refreshToken = Cookies.get(COOKIE_NAME.REFRESH_TOKEN)
    
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshResult = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      )
      if (refreshResult.data) {
        const data: any = refreshResult.data
        Cookies.set(COOKIE_NAME.ACCESS_TOKEN, data.access_token)
        Cookies.set(COOKIE_NAME.REFRESH_TOKEN, data.refresh_token)
        Cookies.set(COOKIE_NAME.ACCESS_TOKEN_EXP, data.exp)
        Cookies.set(COOKIE_NAME.REFRESH_TOKEN_EXP, data.exp_refresh)
        const user = (api.getState() as RootState).auth.user
        api.dispatch(setUser(user))
        result = await baseQuery(args, api, extraOptions)
        isRefreshing = false;
      } else {
        api.dispatch(setUser(null))
        isRefreshing = false;
      }
    }
  }
  return result
}

export { baseQuery, baseQueryWithReauth }
