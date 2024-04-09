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
  state.editTextElements.push(payload.payload)
}

const updateCurrentTimeAction: CaseReducer<EditorSliceState, PayloadAction<number>> = (state, payload) => {
  state.currentTime = payload.payload
}

const updateEditTextAction: CaseReducer<EditorSliceState, PayloadAction<TextEditItemData>> = (state, payload) => {
  const editTextElements = [...state.editTextElements]
  const indexUpdated = state.editTextElements.findIndex((item) => item.id === payload.payload.id)

  if (indexUpdated > -1) {
    state.editTextElements = [
      ...editTextElements.slice(0, indexUpdated),
      payload.payload,
      ...editTextElements.slice(indexUpdated + 1)
    ]
  }
}

export const editorSlice = createSlice({
  name: 'editorSlice',
  initialState,
  reducers: {
    addEditText: addEditTextAction,
    updateEditText: updateEditTextAction,
    updateCurrentTime: updateCurrentTimeAction
  }
})

const { actions, reducer } = editorSlice
export const { addEditText, updateCurrentTime, updateEditText } = actions
export const selectEditTextElements = (state: RootState) => state.editor.editTextElements
export const selectCurrentTime = (state: RootState) => state.editor.currentTime

export default reducer
