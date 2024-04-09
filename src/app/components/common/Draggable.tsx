import { clamp } from '@/app/lib/helper/common'
import { FC, MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react'

export interface DraggableData {
  x: number
  y: number
  offsetX: number
  offsetY: number
  offsetClickX: number
  offsetClickY: number
}

interface DraggableProps {
  axis?: 'x' | 'y'
  isOffsetParent?: boolean
  isLimitParent?: boolean
  rangeX?: {
    min?: number
    max?: number
  }
  rangeY?: {
    min?: number
    max?: number
  }
  handleDrag: (data: DraggableData) => any
  children: ReactNode
}

const Draggable: FC<DraggableProps> = ({
  isOffsetParent = false,
  isLimitParent = false,
  axis,
  handleDrag,
  rangeX,
  rangeY,
  children
}) => {
  const containerDraggable = useRef<HTMLDivElement>(null)
  const isClickedRef = useRef<boolean>(false)
  const posMouseStartMove = useRef<any>(null)

  const onStartDrag = (e: any) => {
    isClickedRef.current = true
    const dragEl = containerDraggable.current?.children[0]
    const rect = dragEl?.getBoundingClientRect()

    posMouseStartMove.current = {
      x: e.clientX,
      y: e.clientY,
      offsetClickX: e.clientX - (rect?.x ?? 0),
      offsetClickY: e.clientY - (rect?.y ?? 0)
    }
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

      if (rangeX) {
        xRes = clamp(xCurrent, rangeX?.min ?? -Infinity, rangeX.max ?? Infinity)
      }

      if (rangeY) {
        yRes = clamp(xCurrent, rangeY?.min ?? -Infinity, rangeY.max ?? Infinity)
      }

      handleDrag({
        x: xRes,
        y: yRes,
        offsetX: xMouse - (posMouseStartMove.current?.x ?? 0),
        offsetY: yMouse - (posMouseStartMove.current?.y ?? 0),
        offsetClickX: posMouseStartMove.current?.offsetClickX,
        offsetClickY: posMouseStartMove.current?.offsetClickY
      })
    }
  }

  const onStopDrag = () => {
    posMouseStartMove.current = null
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
