import { FC, useEffect, useMemo, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { FileWithTempUrl } from '../../sub-version/create/page'
import RulerTime from './RulerTime'
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable'

interface TimelineBarProps {
  file: FileWithTempUrl
}

const TimelineBar: FC<TimelineBarProps> = ({ file }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [leftStick, setLeftStick] = useState(0)
  const audioRef = useRef<any>()
  const containerRulerRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const [rectContainerRuler, setRectContainerRuler] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  })

  const handleListen = () => {
    setCurrentTime(Math.floor(audioRef?.current?.currentTime) ?? 0)
  }

  const handleLoadedMetadata = () => {
    setDuration(Math.floor(audioRef.current?.duration ?? 0))
  }

  const handleChangeCurrentTime: (e: Event) => void = () => {
    setCurrentTime(Math.floor(audioRef?.current?.currentTime) ?? 0)
  }

  const handleDragStick: DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => {
    const { x } = data
    const timeToSet = (x / rectContainerRuler.width) * duration
    if (audioRef?.current) {
      audioRef.current.currentTime = timeToSet
    }
  }

  useEffect(() => {
    setLeftStick((!audioRef?.current ? 0 : currentTime / duration) * 100)
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
          listenInterval={500}
        />
      </div>

      <div ref={containerRulerRef} className='h-[100px]  relative'>
        <div className='absolute top-0 left-0 w-full'>
          <RulerTime duration={Math.floor(duration)} numOfMajorTick={5} numOfMinorTick={5} />
        </div>
        <Draggable axis='x' bounds={{ left: 0, right: rectContainerRuler.width }} onDrag={handleDragStick}>
          <div
            ref={stickRef}
            className='absolute top-[-20px] flex flex-col items-start'
            // style={{
            //   left: `${leftStick}%`
            // }}
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
      </div>
    </div>
  )
}

export default TimelineBar
