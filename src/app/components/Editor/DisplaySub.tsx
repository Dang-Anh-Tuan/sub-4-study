import { updateEditText } from '@/app/lib/redux/editor/editorSlice'
import { useAppDispatch } from '@/app/lib/redux/hook'
import { styled } from '@mui/material'
import { ChangeEvent, FC, useEffect, useState } from 'react'

const DisplayText = styled('textarea')({
  padding: '10px',
  background: 'transparent',
  outline: 'none',
  overflowY: 'hidden',
  maxWidth: '500px',
  width: '500px',
  textAlign: 'center',
  resize: 'none',
  '&:focus': {
    border: '3px dotted #ddd'
  }
})

interface DisplaySubProps {
  editTextItem: TextEditItemData
}

const DisplaySub: FC<DisplaySubProps> = ({ editTextItem }) => {
  const [text, setText] = useState<string>(editTextItem?.value ?? '')
  const dispatch = useAppDispatch()

  useEffect(() => {
    setText(editTextItem?.value ?? '')
  }, [editTextItem])

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const textarea = e.target
    setText(e.target.value)
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    console.log('Textarea blurred')
    dispatch(
      updateEditText({
        ...editTextItem,
        value: event.target.value
      })
    )
  }

  return (
    <div className='bg-#333 w-[900px] h-[600px] flex justify-center items-center overflow-hidden'>
      <DisplayText value={text} onChange={handleChange} onBlur={handleBlur} className='text-white text-[32px]' />
    </div>
  )
}

export default DisplaySub
