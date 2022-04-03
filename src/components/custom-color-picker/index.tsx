import * as React from 'react'

import { Popover } from '@arco-design/web-react'
import { IconUndo } from '@arco-design/web-react/icon'
import { SketchPicker, SketchPickerProps } from 'react-color'
import clsx from 'clsx'

import styles from './index.module.less'
import { devLogger } from '@/common/utils'

export type CustomColorPickerProps = Omit<SketchPickerProps, 'onChange'> & {
  value?: string
  /**
   * @allowReset 是否允许 重置到第一个有意义的值
   */
  allowReset?: boolean
  onChange?: (value?: string) => void
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = (props) => {
  const { value, allowReset = false, onChange, ...rest } = props

  // 初始值 记录初始值(第一个有意义的值)
  const initialValueRef = React.useRef<string | undefined>()

  const handleChange: SketchPickerProps['onChange'] = (colorRes) => {
    onChange?.(colorRes.hex)
  }

  const handleResetClick = () => {
    onChange?.(initialValueRef.current)
  }

  React.useEffect(() => {
    if (!initialValueRef.current) {
      devLogger('initialValueRef update', value, initialValueRef.current)
      initialValueRef.current = value
    }
  }, [value])

  return (
    <div className={styles.custom_color_picker}>
      <Popover
        className={styles.popover_wrapper}
        trigger="click"
        content={
          <SketchPicker
            {...rest}
            color={value}
            className={styles.picker}
            onChange={handleChange}
          />
        }
      >
        <div
          className={clsx(
            styles.color_picker_trigger,
            allowReset && styles.allow_reset
          )}
        >
          <div className={styles.color_value}>{value}</div>
          <div
            className={styles.color_display}
            style={{
              backgroundColor: value,
            }}
          />
        </div>
      </Popover>
      {allowReset && (
        <div className={styles.reset_icon_wrapper}>
          <IconUndo className={styles.reset_icon} onClick={handleResetClick} />
        </div>
      )}
    </div>
  )
}

export default CustomColorPicker
