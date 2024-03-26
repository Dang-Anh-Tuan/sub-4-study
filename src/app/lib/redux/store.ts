import { configureStore } from '@reduxjs/toolkit'
import countReducer from './count/countSlice'
import authReducer from './auth/authSlice'
import { authService } from '../../api/authService'

export const store = configureStore({
  reducer: {
    count: countReducer,
    auth: authReducer,
    [authService.reducerPath]: authService.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authService.middleware)
})

// Infer the type of makeStore
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
