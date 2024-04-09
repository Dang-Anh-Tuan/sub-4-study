import { displayTime, generateMinorTick, generateTick } from '@/app/lib/helper/editor'
import { FC, useMemo } from 'react'

interface RulerTimeProps {
  duration: number
  numOfMajorTick?: number
  numOfMinorTick?: number
}

const RulerTime: FC<RulerTimeProps> = ({ duration, numOfMajorTick = 5, numOfMinorTick = 5 }) => {
  const ticks = useMemo(() => {
    return generateTick(duration, numOfMajorTick)
  }, [duration])

  const minorTicks = useMemo(() => {
    return generateMinorTick(ticks, numOfMinorTick)
  }, [ticks])

  return (
    <div style={{ borderBottom: 'solid 1px #E1E1E3', pointerEvents: 'none' }} className='h-4 relative'>
      {ticks &&
        ticks.map((tick) => (
          <p
            key={tick}
            className='absolute top-[-6px] text-[#888] text-[14px] no-select text-nowrap'
            style={{
              left: `${(tick / duration) * 100}%`,
              transform: 'translateX(-40%)'
            }}
          >
            {displayTime(tick)}
          </p>
        ))}
      {minorTicks &&
        minorTicks.map((minorTick) => (
          <p
            key={minorTick}
            className='absolute top-[-6px] text-[#888] text-[14px] no-select'
            style={{
              left: `${(minorTick / duration) * 100}%`,
              transform: 'translateX(-40%)'
            }}
          >
            .
          </p>
        ))}
    </div>
  )
}

export default RulerTime
