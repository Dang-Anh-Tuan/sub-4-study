import { FC, useEffect, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { FileWithTempUrl } from '../../sub-version/create/page'
import Draggable, { DraggableData } from '../common/Draggable'
import RulerTime from './RulerTime'
import TextEditItem, { TextEditItemData } from './TextEditItem'
import { useAppDispatch } from '@/app/lib/redux/hook'
import { updateCurrentTime } from '@/app/lib/redux/editor/editorSlice'

interface TimelineBarProps {
  file: FileWithTempUrl
  editItems?: TextEditItemData[]
}

const TimelineBar: FC<TimelineBarProps> = ({ file, editItems }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [leftStick, setLeftStick] = useState(0)
  const [dataDrag, setDataDrag] = useState({ x: 0, y: 0 })
  const [dataDragEditTextItem, setDataDragEditTextItem] = useState({})
  const audioRef = useRef<any>()
  const containerRulerRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const [rectContainerRuler, setRectContainerRuler] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })
  const dispatch = useAppDispatch()

  const handleSetCurrentTime = (time: number) => {
    setCurrentTime(time)
    dispatch(updateCurrentTime(time))
  }

  const handleListen = () => {
    handleSetCurrentTime(audioRef?.current?.currentTime ?? 0)
  }

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration ?? 0)
  }

  const handleChangeCurrentTime: (e: Event) => void = () => {
    handleSetCurrentTime(audioRef?.current?.currentTime ?? 0)
  }

  const handleDragStick = (data: DraggableData) => {
    const { x } = data
    setDataDrag((pre) => ({ ...pre, x }))
  }

  const handleUpdateTimeFollowDragData = () => {
    setLeftStick(dataDrag.x)
    const timeToSet = (dataDrag.x / rectContainerRuler.width) * duration

    if (audioRef?.current && duration && rectContainerRuler.width) {
      audioRef.current.currentTime = timeToSet
    }
  }

  function getPositionWithTime(time: number) {
    return (!audioRef?.current ? 0 : time / duration) * rectContainerRuler.width
  }

  function getWidthFromTime(startTime: number, endTime: number) {
    return ((endTime - startTime) / duration) * rectContainerRuler.width
  }

  function onDragEditTextItem(data: DraggableData, id: string) {
    setDataDragEditTextItem((pre) => ({ ...pre, [id]: data }))
  }

  useEffect(() => {
    handleUpdateTimeFollowDragData()
  }, [dataDrag.x, dataDrag.y])

  useEffect(() => {
    console.log('update position edit text')
  }, [dataDragEditTextItem])

  useEffect(() => {
    setLeftStick(getPositionWithTime(currentTime))
  }, [rectContainerRuler, currentTime, duration, audioRef])

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [])

  useEffect(() => {
    const updateRectangleSize = () => {
      if (containerRulerRef.current) {
        const rect = containerRulerRef.current.getBoundingClientRect()
        setRectContainerRuler({ width: rect.width, height: rect.height })
      }
    }
    updateRectangleSize()
    window.addEventListener('resize', updateRectangleSize)
    return () => {
      window.removeEventListener('resize', updateRectangleSize)
    }
  }, [])

  return (
    <div className='h-[250px] px-10 flex flex-col justify-between'>
      <div className='flex justify-center my-6'>
        <ReactAudioPlayer
          src={file.urlFile}
          controls
          className='w-[400px]'
          ref={(element) => {
            audioRef.current = element?.audioEl.current
            element?.audioEl?.current?.addEventListener('loadedmetadata', handleLoadedMetadata)
          }}
          onListen={handleListen}
          onSeeked={handleChangeCurrentTime}
          listenInterval={200}
        />
      </div>
      <div ref={containerRulerRef} className='h-[100px]  relative'>
        <div className='absolute top-0 left-0 w-full'>
          <RulerTime duration={duration} numOfMajorTick={5} numOfMinorTick={5} />
        </div>
        <Draggable
          axis='x'
          isLimitParent
          isOffsetParent
          handleDrag={(data) => {
            handleDragStick(data)
          }}
        >
          <div
            ref={stickRef}
            className='absolute top-[-20px] flex flex-col items-start z-10'
            style={{
              transform: `translateX(${leftStick}px)`
            }}
          >
            <div
              style={{
                border: '10px',
                borderStyle: 'solid',
                borderColor: 'red transparent transparent transparent',
                transform: 'translateX(-50%)'
              }}
              className='cursor-pointer'
            ></div>
            <div className='border-r-2 border-blue-500 border-dashed h-[100px]'></div>
          </div>
        </Draggable>
        <div className='relative  w-full h-full'>
          {editItems &&
            editItems.map((item) => (
              <Draggable
                key={item.id}
                handleDrag={(data) => {
                  onDragEditTextItem(data, item.id)
                }}
              >
                <div
                  className='absolute top-[40px]'
                  style={{
                    transform: `translateX(${getPositionWithTime(item.startTime)}px)`,
                    width: `${getWidthFromTime(item.startTime, item.endTime)}px`
                  }}
                >
                  <TextEditItem data={item} />
                </div>
              </Draggable>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TimelineBar
