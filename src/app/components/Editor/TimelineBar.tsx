import { updateCurrentTime, updateEditText } from '@/app/lib/redux/editor/editorSlice'
import { useAppDispatch } from '@/app/lib/redux/hook'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { FileWithTempUrl } from '../../sub-version/create/page'
import Draggable, { DraggableData } from '../common/Draggable'
import RulerTime from './RulerTime'
import TextEditItem from './TextEditItem'

interface TimelineBarProps {
  file: FileWithTempUrl
  editItems?: TextEditItemData[]
}

interface ItemEditExpand {
  data: TextEditItemData
  width?: number
  translateX?: number
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

  // handle load audio and update time
  const handleSetCurrentTime = (time: number) => {
    setCurrentTime(time)
    dispatch(updateCurrentTime(time))
  }

  const handleListenAudioUpdateTime = () => {
    handleSetCurrentTime(audioRef?.current?.currentTime ?? 0)
  }

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration ?? 0)
  }

  const handleChangeCurrentTime: (e: Event) => void = () => {
    handleSetCurrentTime(audioRef?.current?.currentTime ?? 0)
  }

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
    setLeftStick(getPositionWithTime(currentTime))
  }, [rectContainerRuler, currentTime, duration, audioRef])

  // handle drag stick
  const widthPerSecond = useMemo(() => {
    return rectContainerRuler.width / duration
  }, [rectContainerRuler.width, duration])

  const handleDragStick = (data: DraggableData) => {
    const { x } = data
    setDataDrag((pre) => ({ ...pre, x }))
  }

  const handleUpdateTimeFollowDragData = () => {
    setLeftStick(dataDrag.x)
    const timeToSet = dataDrag.x / widthPerSecond

    if (audioRef?.current && duration && rectContainerRuler.width) {
      audioRef.current.currentTime = timeToSet
    }
  }

  useEffect(() => {
    handleUpdateTimeFollowDragData()
  }, [dataDrag.x, dataDrag.y])

  // handle resize window
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

  // handle load edit item
  function getPositionWithTime(time: number) {
    return (!audioRef?.current ? 0 : time) * widthPerSecond
  }

  function getWidthFromTime(startTime: number, endTime: number) {
    return (endTime - startTime) * widthPerSecond
  }

  const sortedEditItem: TextEditItemData[] = useMemo(() => {
    return [...(editItems ?? [])].sort((a, b) => a.startTime - b.startTime)
  }, [editItems])

  const transformEditItems: ItemEditExpand[] = useMemo(() => {
    const itemsAddedParamsUI: ItemEditExpand[] = sortedEditItem.map((item) => {
      const WIDTH_TO_RESIZE = 30
      const widthOfItem = getWidthFromTime(item.startTime, item.endTime)
      const dataDrag = (dataDragEditTextItem as any)?.[item.id] as DraggableData
      const allowDrag = dataDrag && widthOfItem - (dataDrag?.offsetClickX ?? 0) > WIDTH_TO_RESIZE
      return {
        data: item,
        width: widthOfItem,
        // translateX: allowDrag ? dataDrag.x - dataDrag.offsetClickX : getPositionWithTime(item.startTime)
        translateX: getPositionWithTime(item.startTime)
      }
    })
    return itemsAddedParamsUI
  }, [sortedEditItem, duration, rectContainerRuler.width, dataDragEditTextItem])

  // handle drag edit item
  function onDragEditTextItem(data: DraggableData, id: string) {
    setDataDragEditTextItem({ [id]: data })
  }

  useEffect(() => {
    const keysOfDataDrag = Object.keys(dataDragEditTextItem)
    if (keysOfDataDrag.length > 0) {
      const id = keysOfDataDrag[0]
      const editElement = sortedEditItem.filter((item) => item.id === id)?.[0]
      const dataDrag = (dataDragEditTextItem as any)?.[id] as DraggableData

      const gapTime = dataDrag.offsetX / widthPerSecond
      console.log(gapTime);
      
      if (editElement) {
        const newStartTime = editElement.startTime + gapTime

        dispatch(
          updateEditText({
            ...editElement,
            startTime: newStartTime
          })
        )
      }
    }
  }, [dataDragEditTextItem])

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
          onListen={handleListenAudioUpdateTime}
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
          {transformEditItems &&
            transformEditItems.map((item, index) => (
              <Draggable
                key={item.data.id}
                isLimitParent
                isOffsetParent
                handleDrag={(data) => {
                  onDragEditTextItem(data, item.data.id)
                }}
              >
                <div
                  id={item.data.id}
                  className='absolute top-[40px]'
                  style={{
                    transform: `translateX(${item.translateX ?? 0}px)`,
                    width: `${item.width ?? 0}px`
                  }}
                >
                  <TextEditItem
                    data={item.data}
                    nextEditItem={transformEditItems[index + 1]?.data ?? null}
                    duration={duration}
                    widthContainer={rectContainerRuler.width}
                  />
                </div>
              </Draggable>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TimelineBar
