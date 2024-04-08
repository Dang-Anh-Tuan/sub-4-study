import { useAppDispatch } from '@/app/lib/redux/hook'
import { changeShowFulSideBar } from '@/app/lib/redux/system/systemSlice'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import { IconButton } from '@mui/material'
import { FC, ReactNode, useState } from 'react'
interface SideBarCommonProps {
  children: ReactNode
}

const SideBarCommon: FC<SideBarCommonProps> = ({ children }) => {
  const [isShowFull, setIsShowFull] = useState(true)
  const dispatch = useAppDispatch()

  const handleChangeModeSidebar = () => {
    setIsShowFull((pre) => !pre)
    dispatch(changeShowFulSideBar())
  }
  return (
    <div
      className='relative top-0 left-0  h-[100vh] shadow-lg z-10 flex flex-col items-center'
      style={{
        width: isShowFull ? '300px' : '120px'
      }}
    >
      <IconButton
        aria-label='delete'
        onClick={() => {
          handleChangeModeSidebar()
        }}
        className='!absolute right-0 top-[50px] translate-x-[30%] !bg-white'
      >
        {isShowFull ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
      </IconButton>
      {children}
    </div>
  )
}

export default SideBarCommon
