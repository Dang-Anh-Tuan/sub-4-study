'use client'
import DisplaySub from '@/app/components/Editor/DisplaySub'
import TimelineBar from '@/app/components/Editor/TimelineBar'
import FormUploadFile from '@/app/components/common/Form/FormUploadFile'
import { validateAudioFile } from '@/app/lib/helper/file'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { FC, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'

interface pageProps {}

export interface FileWithTempUrl extends File {
  urlFile: string
}

const SubVersionCreatePage: FC<pageProps> = ({}) => {
  const [audioFile, setAudioFile] = useState<FileWithTempUrl | null>(null)
  const handSelectAudio = (file?: File) => {
    if (!file) return
    if (!validateAudioFile(file)) return
    const urlFile = URL.createObjectURL(file)
    setAudioFile({ ...file, urlFile })
  }
  return (
    <div className='flex flex-col w-full h-[100vh] overflow-hidden'>
      <div className='flex flex-1 justify-center items-center w-full bg-#F7F7F8'>
        {!audioFile ? (
          <FormUploadFile text='Upload audio' onChangeFile={handSelectAudio} startIcon={<CloudUploadIcon />} />
        ) : (
          <DisplaySub subSentence='abc'></DisplaySub>
        )}
      </div>
      {audioFile && <TimelineBar file={audioFile} />}
    </div>
  )
}

export default SubVersionCreatePage
