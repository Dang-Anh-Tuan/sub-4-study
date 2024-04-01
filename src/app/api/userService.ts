import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const userService = createApi({
  reducerPath: 'userServiceApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMe: builder.mutation<IResponse, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET'
      })
    })
  })
})

export const { useGetMeMutation } = userService
