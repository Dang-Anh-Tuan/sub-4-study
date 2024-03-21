import { configureStore } from '@reduxjs/toolkit'
import countReducer from './count/countSlice'

export const store = configureStore({
  reducer: {
    count: countReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

// Infer the type of makeStore
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
