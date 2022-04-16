import * as React from 'react'

import { Image, ImageProps } from '@arco-design/web-react'
import { IconImageClose } from '@arco-design/web-react/icon'

const CustomImage: React.FC<ImageProps> = (props) => {
  const { height, width } = props
  return (
    <Image
      {...props}
      error={
        <IconImageClose
          style={{
            height,
            width,
          }}
        />
      }
    />
  )
}

export default CustomImage
