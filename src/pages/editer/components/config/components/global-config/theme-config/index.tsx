import * as React from 'react'

import { Form, Collapse, FormProps } from '@arco-design/web-react'
import { IconPalette } from '@arco-design/web-react/icon'
import clsx from 'clsx'

import {
  getColorVariableValue,
  setColorVariableValue,
} from '@/common/utils/color-variable'
import { useGlobalConfig } from '@/common/hooks/editer-data'

import styles from './index.module.less'
import { generateColorFormItems } from './utils'
import PaletteModal, { PaletteModalProps } from '../palette-modal'

const { Item: CollapseItem } = Collapse

const ThemeConfig = () => {
  const { configData, updateGlobalConfig } = useGlobalConfig()

  const [colorConfigFom] = Form.useForm()

  const [modalVisible, setModalVisible] = React.useState(false)

  const colorFormItems = React.useMemo(
    () => generateColorFormItems(configData?.customPalette || undefined),
    [configData?.customPalette]
  )

  const showPaletteModal = () => {
    setModalVisible(true)
  }

  const hidePaletteModal = () => {
    setModalVisible(false)
  }

  const handlePaletteModalConfirm: PaletteModalProps['onConfirm'] = (
    paletteColors
  ) => {
    updateGlobalConfig({
      customPalette: paletteColors,
    })
    hidePaletteModal()
  }

  const handleColorConfigFormChange: FormProps['onChange'] = (_, values) => {
    setColorVariableValue(values, true)
    updateGlobalConfig({
      themeConfig: values,
    })
  }

  return (
    <CollapseItem
      header="主题色配置"
      name="global_config.theme_config"
      className={styles.theme_config}
    >
      <div className={styles.form_tip}>
        <span className="tip_text">对调色板预置颜色不满意?点此定制</span>
        <IconPalette
          className={clsx(styles.palette_icon, 'portal_tip_icon')}
          onClick={showPaletteModal}
        />
      </div>
      <Form
        form={colorConfigFom}
        autoComplete="off"
        size="small"
        labelCol={{
          span: 9,
        }}
        wrapperCol={{
          span: 15,
        }}
        labelAlign="left"
        initialValues={configData?.themeConfig || getColorVariableValue('body')}
        onChange={handleColorConfigFormChange}
      >
        {colorFormItems}
      </Form>
      <PaletteModal
        visible={modalVisible}
        onCancel={hidePaletteModal}
        onConfirm={handlePaletteModalConfirm}
      />
    </CollapseItem>
  )
}

export default ThemeConfig
