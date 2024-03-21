import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { COOKIE_NAME } from '../lib/constants'
import Cookies from 'js-cookie'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.ENV === 'production' ? process.env.BASE_URL_PRODUCT : process.env.BASE_URL_DEVELOP,
  prepareHeaders: (headers) => {
    const token = Cookies.get(COOKIE_NAME.ACCESS_TOKEN)
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export { baseQuery }
