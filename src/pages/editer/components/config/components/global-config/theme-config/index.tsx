import * as React from 'react'

import { Form, Collapse, FormProps } from '@arco-design/web-react'
import { IconPalette } from '@arco-design/web-react/icon'
import clsx from 'clsx'

import {
  getColorVariableValue,
  setColorVariableValue,
} from '@/common/utils/color-variable'
import { ColorVarValue } from '@/typings/common/editer-config-data'
import { useGlobalConfig } from '@/common/hooks/editer-data'

import styles from './index.module.less'
import { generateColorFormItems } from './utils'
import PaletteModal, { PaletteModalProps } from '../palette-modal'

const { Item: CollapseItem } = Collapse

const ThemeConfig = () => {
  const { configData, updateGlobalConfig } = useGlobalConfig('theme')

  const [colorConfigFom] = Form.useForm()

  const [customColors, setColors] = React.useState<string[]>([])
  const [modalVisible, setModalVisible] = React.useState(false)

  const colorFormItems = React.useMemo(
    () =>
      generateColorFormItems(
        customColors.length > 0 ? customColors : undefined
      ),
    [customColors]
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
    setColors(paletteColors)
    hidePaletteModal()
  }

  const handleColorConfigFormChange: FormProps['onValuesChange'] = (
    _,
    values
  ) => {
    setColorVariableValue(values, true)
    updateGlobalConfig({
      themeConfig: values,
    })
  }

  React.useEffect(() => {
    if (configData) {
      setColorVariableValue(configData as ColorVarValue, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CollapseItem
      header="主题配置"
      name="page_config.theme_config"
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
        labelCol={{
          span: 9,
        }}
        wrapperCol={{
          span: 15,
        }}
        labelAlign="left"
        initialValues={configData || getColorVariableValue('body')}
        onValuesChange={handleColorConfigFormChange}
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
