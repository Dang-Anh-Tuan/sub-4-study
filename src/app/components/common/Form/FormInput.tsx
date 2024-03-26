import { TextField, TextFieldProps } from '@mui/material'
import { FC } from 'react'
import { Control, Controller } from 'react-hook-form'

type FormInputProps = {
  name: string
  control: Control<any, any>
} & TextFieldProps

const FormInput: FC<FormInputProps> = (props) => {
  const { name, control, ...rest } = props
  return <Controller name={name} control={control} render={({ field }) => <TextField {...rest} {...field} />} />
}

export default FormInput
