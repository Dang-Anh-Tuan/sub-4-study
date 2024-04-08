import { userService } from '@/app/api/userService'
import { configureStore } from '@reduxjs/toolkit'
import { authService } from '../../api/authService'
import authReducer from './auth/authSlice'
import systemReducer from './system/systemSlice'
import countReducer from './count/countSlice'
import editorReducer from './editor/editorSlice'

export const store = configureStore({
  reducer: {
    count: countReducer,
    auth: authReducer,
    system: systemReducer,
    editor: editorReducer,
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
