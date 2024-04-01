'use client'
import Button from '@mui/material/Button'
import { useAppDispatch, useAppSelector } from './lib/redux/hook'
import { increaseCount, selectCount } from './lib/redux/count/countSlice'
import { useAuth } from './lib/hooks/useAuth'
import { selectUser } from './lib/redux/auth/authSlice'
import { useRouter } from 'next/navigation'

export default function Home() {
  const count = useAppSelector(selectCount)
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const { logout } = useAuth()
  const router = useRouter()

  const increase: any = () => {
    dispatch(increaseCount(1))
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex flex-col items-center'>
        <h3>Welcome, {user?.name}</h3>
        <Button variant='contained' onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className='flex flex-col items-center'>
        <h3 className='text-[24px] font-bold'>{count}</h3>
        <Button variant='contained' onClick={increase}>
          Increase
        </Button>
      </div>
    </main>
  )
}
