import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FC } from 'react'

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

type FormUploadFileProps = {
  text: string
  hideText?: boolean
  onChangeFile: (file?: File) => void
} & ButtonProps

const FormUploadFile: FC<FormUploadFileProps> = (props) => {
  const { text, onChangeFile, hideText = false, ...rest } = props

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    onChangeFile(file)
  }

  return (
    <Button component='label' role={undefined} variant='contained' tabIndex={-1} {...rest}>
      {hideText ? '' : text}
      <VisuallyHiddenInput type='file' onChange={handleFileChange} />
    </Button>
  )
}

export default FormUploadFile
