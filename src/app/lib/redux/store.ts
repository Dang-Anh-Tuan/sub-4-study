import { configureStore } from '@reduxjs/toolkit'
import countReducer from './count/countSlice'
import authReducer from './auth/authSlice'
import { authService } from '../../api/authService'
import { userService } from '@/app/api/userService'

export const store = configureStore({
  reducer: {
    count: countReducer,
    auth: authReducer,
    [authService.reducerPath]: authService.reducer,
    [userService.reducerPath]: userService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authService.middleware).concat(userService.middleware)
})

// Infer the type of makeStore
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
