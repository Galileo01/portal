import * as React from 'react'

import { RCClassnameComputer } from '../utils'

export type ContentTitleProps = {
  title?: string
  secondaryText?: Array<string>
  /**
   * @isRC 是否作为独立的 源组件
   */
  isRC?: boolean
}

const ContentTitle: React.FC<ContentTitleProps> = (props) => {
  const { title, secondaryText, isRC = true, ...elementProps } = props

  return (
    <div
      {...elementProps}
      className={RCClassnameComputer({ isRC }, 'content_title')}
    >
      {title && <h2 className="section_title">{title}</h2>}
      <div className="paragraph_wrapper">
        {secondaryText?.map((text) => (
          <p className="paragraph" key={text}>
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ContentTitle
