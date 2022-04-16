import * as React from 'react'

import { Image, ImageProps } from '@arco-design/web-react'
import { IconImageClose } from '@arco-design/web-react/icon'

const CustomImage: React.FC<ImageProps> = (props) => (
  <Image {...props} error={<IconImageClose />} />
)

export default CustomImage
