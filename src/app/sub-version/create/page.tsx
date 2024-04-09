'use client'
import DisplaySub from '@/app/components/Editor/DisplaySub'
import SideBarEditor from '@/app/components/Editor/SideBarEditor'
import TimelineBar from '@/app/components/Editor/TimelineBar'
import FormUploadFile from '@/app/components/common/Form/FormUploadFile'
import { validateAudioFile } from '@/app/lib/helper/file'
import { selectCurrentTime, selectEditTextElements } from '@/app/lib/redux/editor/editorSlice'
import { useAppSelector } from '@/app/lib/redux/hook'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { FC, useMemo, useState } from 'react'

interface pageProps {}

export interface FileWithTempUrl extends File {
  urlFile: string
}

const SubVersionCreatePage: FC<pageProps> = ({}) => {
  const [audioFile, setAudioFile] = useState<FileWithTempUrl | null>(null)
  const editTextItems = useAppSelector(selectEditTextElements)
  const currentTime = useAppSelector(selectCurrentTime)

  const appliedEditElements = useMemo(() => {
    return editTextItems.filter((item) => item.startTime <= currentTime && item.endTime >= currentTime)
  }, [editTextItems, currentTime])

  const handSelectAudio = (file?: File) => {
    if (!file) return
    if (!validateAudioFile(file)) return
    const urlFile = URL.createObjectURL(file)
    setAudioFile({ ...file, urlFile })
  }

  return (
    <div className='flex'>
      <SideBarEditor handSelectAudio={handSelectAudio} />
      <div className='flex-1 flex flex-col w-full h-[100vh] overflow-hidden'>
        <div className='flex flex-1 justify-center items-center w-full bg-#F7F7F8'>
          {!audioFile ? (
            <FormUploadFile text='Upload audio' onChangeFile={handSelectAudio} startIcon={<CloudUploadIcon />} />
          ) : (
            <DisplaySub editTextItem={appliedEditElements?.[0]}></DisplaySub>
          )}
        </div>
        {audioFile && <TimelineBar file={audioFile} editItems={editTextItems} />}
      </div>
    </div>
  )
}

export default SubVersionCreatePage
