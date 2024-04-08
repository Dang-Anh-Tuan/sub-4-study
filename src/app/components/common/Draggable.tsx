import { clamp } from '@/app/lib/helper/common'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'

export interface DraggableData {
  x: number
  y: number
}

interface DraggableProps {
  axis?: 'x' | 'y'
  isOffsetParent?: boolean
  isLimitParent?: boolean
  handleDrag: (data: DraggableData) => any
  children: ReactNode
}

const Draggable: FC<DraggableProps> = ({
  isOffsetParent = false,
  isLimitParent = false,
  axis,
  handleDrag,
  children
}) => {
  const containerDraggable = useRef<HTMLDivElement>(null)
  const isClickedRef = useRef<boolean>(false)

  const onStartDrag = () => {
    isClickedRef.current = true
  }

  const onDrag = (e: MouseEvent) => {
    if (isClickedRef.current) {
      const parentEl = containerDraggable.current?.parentElement
      let startPosition = {
        x: 0,
        y: 0
      }
      const rect = parentEl?.getBoundingClientRect()
      const xParent = rect?.x ?? 0
      const yParent = rect?.y ?? 0
      const widthParent = rect?.width ?? 0
      const heightParent = rect?.height ?? 0

      if (parentEl && isOffsetParent) {
        startPosition = {
          x: xParent,
          y: yParent
        }
      }

      const xMouse = e.clientX
      const yMouse = e.clientY

      const xCurrent = axis === 'y' ? 0 : xMouse - startPosition.x
      const yCurrent = axis === 'x' ? 0 : yMouse - startPosition.y

      let xRes = xCurrent
      let yRes = yCurrent

      if (isLimitParent) {
        const minX = isOffsetParent ? 0 : xParent
        const maxX = isOffsetParent ? widthParent : xParent + widthParent
        const minY = isOffsetParent ? 0 : yParent
        const maxY = isOffsetParent ? heightParent : yParent + heightParent

        xRes = clamp(xCurrent, minX, maxX)
        yRes = clamp(yCurrent, minY, maxY)
      }

      handleDrag({ x: xRes, y: yRes })
    }
  }

  const onStopDrag = () => {
    isClickedRef.current = false
  }

  useEffect(() => {
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', onStopDrag)

    return () => {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', onStopDrag)
    }
  }, [])

  return (
    <div ref={containerDraggable} onMouseDown={onStartDrag}>
      {children}
    </div>
  )
}

export default Draggable
