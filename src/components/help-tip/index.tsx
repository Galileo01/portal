import * as React from 'react'

import { Tooltip, TooltipProps } from '@arco-design/web-react'
import { IconQuestionCircle } from '@arco-design/web-react/icon'

const HelpTip: React.FC<TooltipProps> = (props) => (
  <Tooltip {...props}>
    <IconQuestionCircle className="question_icon" />
  </Tooltip>
)

export default HelpTip
