import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface AuthSliceState {
  user: User | null
}

const initialState: AuthSliceState  = {
  user: null
}

const setUserAction: CaseReducer<AuthSliceState, PayloadAction<User | null>> = (state, action) => {
  state.user = action.payload;
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUser: setUserAction
  }
});

const { actions, reducer } = authSlice

export const selectUser = (state: RootState) => state.auth.user
export const { setUser } = actions
export default reducer


