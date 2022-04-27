import * as React from 'react'

import { RCClassnameComputer } from '../utils'

export type ContentTitleProps = {
  title?: string
  secondaryText?: Array<string>
}

const ContentTitle: React.FC<ContentTitleProps> = (props) => {
  const { title, secondaryText, ...restProps } = props

  return (
    <div {...restProps} className={RCClassnameComputer({})}>
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
