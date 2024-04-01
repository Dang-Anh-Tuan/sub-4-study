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
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: '/auth/login',
        method: 'POST',
        body: payload
      })
    }),
    refresh: builder.mutation({
      query: (payload) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: payload
      })
    }),
    getMeWithoutReauth: builder.mutation<IResponse, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET'
      })
    })
  })
})

export const { 
  useRegisterMutation, 
  useLoginMutation, 
  useRefreshMutation, 
  useGetMeWithoutReauthMutation 
} = authService
