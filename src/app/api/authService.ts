import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'

export const authService = createApi({
  reducerPath: 'authServiceApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload
      })
    })
  })
})

export const { useRegisterMutation } = authService
