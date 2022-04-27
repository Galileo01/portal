import * as React from 'react'

import clsx from 'clsx'

import { Image, ImageProps } from '@arco-design/web-react'
import { IconImageClose } from '@arco-design/web-react/icon'

const CustomImage: React.FC<ImageProps> = (props) => {
  const { height, width, preview = false, className } = props
  return (
    <Image
      className={clsx('custom_image', className)}
      preview={preview}
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
