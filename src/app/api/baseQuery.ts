import { BaseQueryFn, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { COOKIE_NAME } from '../lib/constants'
import Cookies from 'js-cookie'
import { FetchArgs } from '@reduxjs/toolkit/query'
import { RootState } from '../lib/redux/store'

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

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions)

//   if (result.error?.status === 403) {
//     //  Sending refresh token
//     const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
//     if (refreshResult.data) {
//       const user = (api.getState() as RootState).auth.user
//       // TODO : May be should call info user again
//       const credentials = {
//         user,
//         token: (refreshResult.data as { accessToken: string }).accessToken as
//           | string
//           | null
//           | undefined
//       }
//       api.dispatch(setCredentials(credentials))

//       // retry the original query with new access token
//       result = await baseQuery(args, api, extraOptions)
//     } else {
//       api.dispatch(logout())
//     }
//   }
//   return result
// }

export { baseQuery }
