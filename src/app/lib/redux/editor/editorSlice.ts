import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface EditorSliceState {
  editTextElements: TextEditItemData[]
  currentTime: number
}

const initialState = {
  editTextElements: [
    {
      id: '1',
      value: 'Basic tactics for listening second edition',
      startTime: 10,
      endTime: 12
    },
    {
      id: '2',
      value: 'By Jack C.Richards',
      startTime: 12,
      endTime: 14
    },
    {
      id: '3',
      value: 'Public and copyright Oxford university brands',
      startTime: 14,
      endTime: 17
    },
    {
      id: '4',
      value: '2003',
      startTime: 17,
      endTime: 18
    }
  ],
  currentTime: 0
}

const addEditTextAction: CaseReducer<EditorSliceState, PayloadAction<TextEditItemData>> = (state, payload) => {
  console.log(payload.payload)

  state.editTextElements.push(payload.payload)
}

const updateCurrentTimeAction: CaseReducer<EditorSliceState, PayloadAction<number>> = (state, payload) => {
  state.currentTime = payload.payload
}

export const editorSlice = createSlice({
  name: 'editorSlice',
  initialState,
  reducers: {
    addEditText: addEditTextAction,
    updateCurrentTime: updateCurrentTimeAction
  }
})

const { actions, reducer } = editorSlice
export const { addEditText, updateCurrentTime } = actions
export const selectEditTextElements = (state: RootState) => state.editor.editTextElements
export const selectCurrentTime = (state: RootState) => state.editor.currentTime

export default reducer
