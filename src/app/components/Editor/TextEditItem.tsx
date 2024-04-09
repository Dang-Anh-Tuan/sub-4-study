import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { useAppDispatch } from '@/app/lib/redux/hook'
import { updateEditText } from '@/app/lib/redux/editor/editorSlice'

interface TextEditItemProps {
  data: TextEditItemData
  nextEditItem: TextEditItemData | null
  duration: number
  widthContainer: number
}

const TextEditItem: FC<TextEditItemProps> = ({ data, nextEditItem, duration, widthContainer }) => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const initialResizeHandled = useRef(false)

  // handle resize edit item
  const widthPerSecond = useMemo(() => {
    return widthContainer / duration
  }, [widthContainer, duration])

  const maxWidth = useMemo(() => {
    const maxTime = (nextEditItem?.startTime ?? duration) - data.startTime
    return maxTime * widthPerSecond
  }, [data, nextEditItem, duration])

  function handleUpdateTimeFollowResize(width: number) {
    const newEndTime = data.startTime + width / widthPerSecond
    dispatch(
      updateEditText({
        ...data,
        endTime: newEndTime
      })
    )
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      if (ref.current && initialResizeHandled.current) {
        const widthEl = ref.current.offsetWidth
        handleUpdateTimeFollowResize(widthEl)
      }
      initialResizeHandled.current = true
    }, 200)

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      resizeObserver.disconnect()
      handleResize.cancel()
    }
  }, [])
  return (
    <div
      ref={ref}
      className='bg-[#6da7cd] p-2 rounded-[8px] text-white no-select truncate resize-x cursor-pointer'
      style={{
        maxWidth: `${maxWidth}px`
      }}
    >
      <p className='no-select truncate'>{data.value}</p>
    </div>
  )
}

export default TextEditItem
