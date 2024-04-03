import { FC } from 'react'

interface DisplaySubProps {
  subSentence: string
}

const DisplaySub: FC<DisplaySubProps> = ({ subSentence }) => {
  return (
    <div className='bg-#333 w-[900px] h-[600px] flex justify-center items-center'>
      <p className='text-white text-[32px]'>{subSentence}</p>
    </div>
  )
}

export default DisplaySub
