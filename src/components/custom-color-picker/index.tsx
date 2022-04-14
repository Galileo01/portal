import * as React from 'react'

import { Popover } from '@arco-design/web-react'
import { IconClose } from '@arco-design/web-react/icon'
import { SketchPicker, SketchPickerProps } from 'react-color'
import clsx from 'clsx'
import tinycolor from 'tinycolor2'

import styles from './index.module.less'

export type CustomColorPickerProps = Omit<SketchPickerProps, 'onChange'> & {
  value?: string
  /**
   * @allowClear 是否允许 重置到第一个有意义的值
   */
  allowClear?: boolean
  /**
   * @clearToValid 是否清空到第一个有意义的值
   */
  clearToValid?: boolean
  /**
   * 是否展示 hex 的值
   */
  showHexValue?: boolean
  onChange?: (value?: string) => void
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = (props) => {
  const {
    value,
    showHexValue = true,
    allowClear = false,
    clearToValid = false,
    onChange,
    ...rest
  } = props

  // 初始值 记录初始值(第一个有意义的值)
  const initialValueRef = React.useRef<string | undefined>()

  const handleChange: SketchPickerProps['onChange'] = (colorRes) => {
    const { r, g, b, a } = colorRes.rgb
    // 携带 透明度
    onChange?.(tinycolor({ r, g, b, a }).toHex8String())
  }

  const handleResetClick = () => {
    onChange?.(clearToValid ? initialValueRef.current : undefined)
  }

  React.useEffect(() => {
    if (!initialValueRef.current) {
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
            allowClear && styles.allow_clear
          )}
        >
          {showHexValue && <div className={styles.color_value}>{value}</div>}
          <div
            className={styles.color_display}
            style={{
              backgroundColor: value,
            }}
          />
        </div>
      </Popover>
      {allowClear && (
        <div className={styles.clear_icon_wrapper}>
          <IconClose className={styles.clear_icon} onClick={handleResetClick} />
        </div>
      )}
    </div>
  )
}

export default CustomColorPicker
