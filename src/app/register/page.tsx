'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, Paper } from '@mui/material'
import Container from '@mui/material/Container'
import Link from 'next/link'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useRegisterMutation } from '../api/authService'
import FormInput from '../components/common/Form/FormInput'
import { HttpStatus, MESSAGE, REGEX_PASSWORD } from '../lib/constants'
import { useToast } from '../lib/hooks/useToast'
import { useAuth } from '../lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface pageProps {}

interface IFormInput {
  name: string
  email: string
  username: string
  password: string
  confirm_password: string
}

const schema = yup
  .object({
    name: yup.string().required(MESSAGE.REQUIRE),
    email: yup.string().email(MESSAGE.EMAIL_NOT_VALID).required(MESSAGE.REQUIRE),
    username: yup.string().required(MESSAGE.REQUIRE),
    password: yup.string().required(MESSAGE.REQUIRE).matches(REGEX_PASSWORD, MESSAGE.FORM_PASSWORD),
    confirm_password: yup.string().required(MESSAGE.REQUIRE).matches(REGEX_PASSWORD, MESSAGE.FORM_PASSWORD)
  })
  .required()

const RegisterPage: FC<pageProps> = ({}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('')
  const [register] = useRegisterMutation()
  const toast = useToast()
  const { login } = useAuth()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: ''
    },
    resolver: yupResolver(schema)
  })

  const handleRegister = async (data: IFormInput) => {
    const { password, confirm_password } = data
    if (password !== confirm_password) {
      setErrorConfirmPassword(MESSAGE.CONFIRM_PASSWORD_NOT_SAME)
    } else {
      setErrorConfirmPassword('')

      const { data: res }: any = await register(data)
      if (res.status === HttpStatus.OK) {
        toast.success(MESSAGE.REGISTER_SUCCESS)
        const isLoginSuccess = await login({ username: data.username, password: data.password })
        if (isLoginSuccess) {
          router.push('/')
        }
      } else if (res.status === HttpStatus.UNPROCESSABLE_ENTITY) {
        toast.error(res?.error)
      } else {
        toast.error(MESSAGE.SOMETHING_WRONG)
      }
    }
  }

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    handleRegister(data)
  }

  return (
    <Container className='w-[100vw] h-[100vh] !max-w-none !flex justify-center items-center'>
      <Paper elevation={3} className='w-[400px] flex flex-col items-center justify-between p-10'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center w-full'>
          <h3 className='text-[24px] font-bold mt-5 mb-8'>Register</h3>
          <FormInput
            name='name'
            control={control}
            label='Name'
            variant='standard'
            className='w-full !mb-8'
            error={!!errors.name}
            helperText={errors.name?.message ?? ''}
          />
          <FormInput
            name='email'
            control={control}
            label='Email'
            variant='standard'
            className='w-full !mb-8'
            error={!!errors.email}
            helperText={errors.email?.message ?? ''}
          />
          <FormInput
            name='username'
            control={control}
            label='Username'
            variant='standard'
            className='w-full !mb-8'
            error={!!errors.username}
            helperText={errors.username?.message ?? ''}
          />
          <FormInput
            name='password'
            control={control}
            label='Password'
            type={showPassword ? 'text' : 'password'}
            variant='standard'
            className='w-full !mb-8'
            error={!!errors.password}
            helperText={errors.password?.message ?? ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {' '}
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowPassword((pre) => !pre)}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <FormInput
            name='confirm_password'
            control={control}
            label='Confirm'
            type={showConfirmPassword ? 'text' : 'password'}
            variant='standard'
            className='w-full !mb-8'
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message ?? ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {' '}
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowConfirmPassword((pre) => !pre)}
                    edge='end'
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {errorConfirmPassword && <p className='text-red-500 text-[12px] italic mb-2'>{errorConfirmPassword}</p>}
          <Button type='submit' className='w-full !mt-5' variant='contained' color='primary'>
            Register
          </Button>
          <div className='mt-8'>
            <Link href='/login'>
              <p className='text-blue-500'>Go to login</p>
            </Link>
          </div>
        </form>
      </Paper>
    </Container>
  )
}

export default RegisterPage
