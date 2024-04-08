import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface SystemSliceState {
  isShowFullSideBar: boolean
}

const initialState = {
  isShowFullSideBar: true
}

const changeShowFulSideBarAction: CaseReducer<SystemSliceState, PayloadAction<void>> = (state) => {
  state.isShowFullSideBar = !state.isShowFullSideBar
}

export const systemSlice = createSlice({
  name: 'systemSlice',
  initialState,
  reducers: {
    changeShowFulSideBar: changeShowFulSideBarAction
  }
})

const { actions, reducer } = systemSlice

export const selectIsShowFullSideBar = (state: RootState) => state.system.isShowFullSideBar
export const { changeShowFulSideBar } = actions
export default reducer
