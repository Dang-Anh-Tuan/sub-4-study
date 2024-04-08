import { SvgIconComponent } from '@mui/icons-material'
import { ChangeEvent, FC } from 'react'

interface ButtonSideBarProps {
  icon?: SvgIconComponent
  text?: string
  color?: string
  textColor?: string
  hideText?: boolean
  action?: Function
}

const ButtonSideBar: FC<ButtonSideBarProps> = ({ icon: Icon, text, color, textColor, hideText = true, action }) => {
  return (
    <button
      className={`flex p-4 w-full ${!hideText && 'justify-center'}`}
      onClick={() => {
        if (action) {
          action()
        }
      }}
    >
      {Icon && (
        <div
          className='w-[60px] h-[60px] bg-purple-200 flex justify-center items-center rounded-full'
          style={{
            background: color
          }}
        >
          {<Icon sx={{ color: 'white' }} />}
        </div>
      )}
      {hideText && (
        <p className='min-w-[100px] text-start h-[60px] flex items-center pl-3' style={{ color: textColor }}>
          {text ?? ''}
        </p>
      )}
    </button>
  )
}

export default ButtonSideBar
