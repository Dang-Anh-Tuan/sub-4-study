import { MESSAGE } from '@/app/lib/constants'
import { useToast } from '@/app/lib/hooks/useToast'
import { addEditText, selectCurrentTime, selectEditTextElements } from '@/app/lib/redux/editor/editorSlice'
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hook'
import { selectIsShowFullSideBar } from '@/app/lib/redux/system/systemSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import TitleIcon from '@mui/icons-material/Title'
import { useRouter } from 'next/navigation'
import { FC, useMemo } from 'react'
import ButtonSideBar from '../common/ButtonSideBar'
import FormUploadFile from '../common/Form/FormUploadFile'
import SideBarCommon from '../common/SideBarCommon'
import { uuid } from 'uuidv4'
import { findStartTimeForNewEditItem } from '@/app/lib/helper/editor'
interface SideBarEditorProps {
  handSelectAudio: (file?: File) => void
}

const SideBarEditor: FC<SideBarEditorProps> = ({ handSelectAudio }) => {
  const router = useRouter()
  const isShowFull = useAppSelector(selectIsShowFullSideBar)
  const toast = useToast()
  const editTextItems = useAppSelector(selectEditTextElements)
  const currentTime = useAppSelector(selectCurrentTime)
  const dispatch = useAppDispatch()

  const appliedEditElements = useMemo(() => {
    return editTextItems.filter((item) => item.startTime <= currentTime && item.endTime >= currentTime)
  }, [editTextItems, currentTime])

  function backToHomePage() {
    router.push('/')
  }

  function addNewEditText() {
    if (appliedEditElements.length > 0) {
      toast.warn(MESSAGE.EDIT_TEXT_ITEM_EXIST)
      return
    }

    dispatch(
      addEditText({
        id: uuid(),
        value: 'Text...',
        startTime: findStartTimeForNewEditItem(editTextItems, currentTime),
        endTime: currentTime
      })
    )
  }

  const buttons = [
    {
      icon: ArrowBackIcon,
      text: 'Back',
      color: '#febe32',
      textColor: '#AAA',
      action: backToHomePage
    },
    {
      icon: TitleIcon,
      text: 'Add Text',
      color: '#C2C4C8',
      textColor: '#AAA',
      action: addNewEditText
    }
  ]

  return (
    <SideBarCommon>
      <div className='w-full mt-[50px]'>
        {buttons &&
          buttons.map((item) => (
            <ButtonSideBar
              key={item.text}
              icon={item.icon}
              text={item.text}
              color={item.color}
              textColor={item.textColor}
              hideText={isShowFull}
              action={item.action}
            ></ButtonSideBar>
          ))}
        <div className='flex justify-center mt-4'>
          <FormUploadFile
            text='Upload audio'
            onChangeFile={handSelectAudio}
            startIcon={<CloudUploadIcon />}
            hideText={!isShowFull}
          />
        </div>
      </div>
    </SideBarCommon>
  )
}

export default SideBarEditor
