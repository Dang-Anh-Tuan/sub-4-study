'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Paper } from '@mui/material'
import Container from '@mui/material/Container'
import Link from 'next/link'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import FormInput from '../components/common/Form/FormInput'
import { MESSAGE } from '../lib/constants'
import { useAuth } from '../lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

export interface IFormLogin {
  username: string
  password: string
}

interface pageProps {}

const schema = yup
  .object({
    username: yup.string().required(MESSAGE.REQUIRE),
    password: yup.string().required(MESSAGE.REQUIRE)
  })
  .required()

const LoginPage: FC<pageProps> = ({}) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })
  const { login } = useAuth()
  const router = useRouter()

  const onSubmit = async (data: IFormLogin) => {
    const isLoginSuccess = await login(data)

    if (isLoginSuccess) {
      const hrefRedirectParam = sessionStorage.getItem('redirect')
      const hrefRedirect = hrefRedirectParam ?? '/'
      sessionStorage.removeItem('redirect')
      router.push(hrefRedirect)
    }
  }

  return (
    <Container className='w-[100vw] h-[100vh]  !max-w-none !flex justify-center items-center'>
      <Paper elevation={3} className='w-[400px] h-[500px] flex flex-col items-center justify-between p-10'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center w-full h-full  justify-between'>
          <div className='flex flex-col items-center w-full'>
            <h3 className='text-[24px] font-bold mt-5 mb-8'>Login</h3>
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
              type='password'
              variant='standard'
              className='w-full'
              error={!!errors.password}
              helperText={errors.password?.message ?? ''}
            />
            <Button type='submit' className='w-full !mt-10' variant='contained' color='primary'>
              Login
            </Button>
          </div>
          <div>
            <Link href='/register'>
              <p className='text-blue-500'>Go to register</p>
            </Link>
          </div>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginPage
