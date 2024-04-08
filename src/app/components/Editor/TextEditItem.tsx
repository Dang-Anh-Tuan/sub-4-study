import { FC } from 'react'

interface TextEditItemProps {
  data: TextEditItemData
}

const TextEditItem: FC<TextEditItemProps> = ({ data }) => {
  return (
    <div className='bg-[#6da7cd] p-2 rounded-[8px] text-white no no-select truncate resize-x cursor-pointer'>
      {data.value}
    </div>
  )
}

export default TextEditItem
