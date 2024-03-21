'use client'

import { FC, useState } from 'react'
import Container from '@mui/material/Container'
import { Paper, TextField, Button } from '@mui/material'
import Link from 'next/link'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [username, setUsername] = useState<string>('')

  return (
    <Container className='w-[100vw] h-[100vh] !max-w-none !flex justify-center items-center'>
      <Paper elevation={3} className='w-[400px] flex flex-col items-center justify-between p-10'>
        <div className='flex flex-col items-center w-full'>
          <h3 className='text-[24px] font-bold mt-5 mb-8'>Register</h3>
          <TextField label='Name' variant='standard' className='w-full !mb-8' />
          <TextField label='Email' type='email' variant='standard' className='w-full !mb-8' />
          <TextField label='Username' variant='standard' className='w-full !mb-8' />
          <TextField label='Password' type='password' variant='standard' className='w-full !mb-8' />
          <TextField label='Confirm' type='password' variant='standard' className='w-full !mb-8' />
          <Button className='w-full !mt-5' variant='contained' color='primary'>
            Register
          </Button>
        </div>
        <div className='mt-8'>
          <Link href='/login'>
            <p className='text-blue-500'>Go to login</p>
          </Link>
        </div>
      </Paper>
    </Container>
  )
}

export default page
