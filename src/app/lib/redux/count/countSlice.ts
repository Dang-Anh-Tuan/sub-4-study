import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface CountSliceState {
  count: number
}

const initialState = {
  count: 0
}

const increaseCountAction: CaseReducer<CountSliceState, PayloadAction<number>> = (state, payload) => {
  state.count += payload.payload
}

export const countSlice = createSlice({
  name: 'countSlice',
  initialState,
  reducers: {
    increaseCount: increaseCountAction
  }
})

const { actions, reducer } = countSlice

export const selectCount = (state: RootState) => state.count.count
export const { increaseCount } = actions
export default reducer