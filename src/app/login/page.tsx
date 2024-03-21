'use client'

import { FC, useState } from 'react'
import Container from '@mui/material/Container'
import { Paper, TextField, Button } from '@mui/material'
import Link from 'next/link'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [username, setUsername] = useState<string>('')

  return (
    <Container className='w-[100vw] h-[100vh]  !max-w-none !flex justify-center items-center'>
      <Paper elevation={3} className='w-[400px] h-[500px] flex flex-col items-center justify-between p-10'>
        <div className='flex flex-col items-center w-full'>
          <h3 className='text-[24px] font-bold mt-5 mb-8'>Login</h3>
          <TextField label='Username' variant='standard' className='w-full !mb-8' />
          <TextField label='Password' type='password' variant='standard' className='w-full' />
          <Button className='w-full !mt-10' variant='contained' color='primary'>
            Login
          </Button>
        </div>
        <div>
          <Link href='/register'>
            <p className='text-blue-500'>Go to register</p>
          </Link>
        </div>
      </Paper>
    </Container>
  )
}

export default page
