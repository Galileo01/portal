import * as React from 'react'

import { Form, Collapse, FormProps } from '@arco-design/web-react'
import { IconPalette } from '@arco-design/web-react/icon'
import clsx from 'clsx'

import { devLogger } from '@/common/utils'
import {
  getColorVariableValue,
  setColorVariableValue,
} from '@/common/utils/color-variable'

import styles from './index.module.less'
import { generateColorFormItems } from './utils'
import PaletteModal, { PaletteModalProps } from '../palette-modal'

const { Item: CollapseItem } = Collapse

const ThemeConfig = () => {
  const [colorConfigFom] = Form.useForm()
  const [componentConfigFom] = Form.useForm()

  const [customColors, setColors] = React.useState<string[]>([])
  const [modalVisible, setModalVisible] = React.useState(false)

  React.useEffect(() => {
    devLogger('666', 'customColors', customColors)
  }, [customColors])

  const colorFormItems = React.useMemo(() => {
    devLogger('666', 'generateColorFormItems')
    return generateColorFormItems(
      customColors.length > 0 ? customColors : undefined
    )
  }, [customColors])

  const showPaletteModal = () => {
    setModalVisible(true)
  }

  const hidePaletteModal = () => {
    setModalVisible(false)
  }

  const handlePaletteModalConfirm: PaletteModalProps['onConfirm'] = (
    paletteColors
  ) => {
    setColors(paletteColors)
    hidePaletteModal()
  }

  const handleColorConfigFormChange: FormProps['onValuesChange'] = (
    _,
    values
  ) => {
    devLogger('ThemeConfig', 'handleColorConfigForm', values)
    setColorVariableValue(values, true)
  }

  /**
   * FIXME:
   *  1.colorFormItems 重复计算问题
   *  2.example 组件 拖拽问题
   */

  React.useEffect(() => {
    devLogger('666', 'setFieldsValue')
    colorConfigFom.setFieldsValue(getColorVariableValue())
  }, [colorConfigFom])

  return (
    <CollapseItem
      header="主题配置"
      name="theme_config"
      className={styles.theme_config}
    >
      <div>
        <div className={clsx(styles.form_title, styles.color_title)}>
          <span>颜色配置</span>
          <span className={clsx(styles.tip_text, 'tip_text')}>
            对调色板预置颜色不满意?点此定制
          </span>
          <IconPalette
            className={styles.palette_icon}
            onClick={showPaletteModal}
          />
        </div>
        <Form
          form={colorConfigFom}
          labelCol={{
            span: 9,
          }}
          wrapperCol={{
            span: 15,
          }}
          labelAlign="left"
          onValuesChange={handleColorConfigFormChange}
        >
          {colorFormItems}
        </Form>
        <PaletteModal
          visible={modalVisible}
          onCancel={hidePaletteModal}
          onConfirm={handlePaletteModalConfirm}
        />
      </div>
      <div>
        <div className={styles.form_title}>组件配置</div>
        <Form
          form={componentConfigFom}
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 16,
          }}
          labelAlign="left"
        />
      </div>
    </CollapseItem>
  )
}

export default ThemeConfig
