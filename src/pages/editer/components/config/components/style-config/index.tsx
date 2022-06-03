import * as React from 'react'

import {
  Collapse,
  Form,
  Button,
  FormProps,
  Divider,
} from '@arco-design/web-react'
import { cloneDeep } from 'lodash-es'

import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { useFetchDataStore } from '@/store/fetch-data'
import {
  generateSelector,
  generateUniqueNodeFromSelector,
  removeStyleNode,
} from '@/common/utils/element'
import { composedValuesTransformer } from '@/common/utils/style-transformer'
import { updateTargetElementStyleNode } from '@/common/utils/style-config'

import { COLLAPSE_BASE_PROPS } from '../../config'
import LayoutForm from './layout-form'
import FontForm from './font-form'
import BackgroundForm from './background-form'
import BorderForm from './border-form'
import styles from './index.module.less'

const { Item: CollapseItem } = Collapse

export type StyleConfigProps = {
  active: boolean
}

// TODO: 4.25-1 添加元素  hover 时的样式填入 增加切换还是什么？

// NOTE: 新添字段 需要同步到  @/common/constant/style-config EDITABLE_FIELD

const StyleConfig: React.FC<StyleConfigProps> = ({ active }) => {
  const { currentClickElement, globalConfig, styleConfig } =
    useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()
  const { allFontList } = useFetchDataStore()

  const [styleConfigForm] = Form.useForm()

  const usedFontList = React.useMemo(() => {
    const usedFontNames = globalConfig?.fontConfig?.usedFont?.map(
      (value) => value[1]
    )
    return allFontList
      .filter((font) => usedFontNames?.includes(font.name))
      .map((font) => font.name)
  }, [allFontList, globalConfig])

  const targetElementInfo = React.useMemo(() => {
    const selector = currentClickElement
      ? generateSelector(currentClickElement)
      : ''
    const styleNodeId = selector ? generateUniqueNodeFromSelector(selector) : ''
    const configIndex =
      styleConfig?.findIndex((config) => config.styleNodeId === styleNodeId) ??
      -1

    return {
      selector,
      styleNodeId,
      configIndex,
    }
  }, [currentClickElement, styleConfig])

  const handleChange: FormProps['onChange'] = (value, values) => {
    if (currentClickElement) {
      const { styleNodeId, selector } = targetElementInfo

      // 更新 store
      // 修改
      if (targetElementInfo.configIndex > -1) {
        // 深拷贝 防止  由于同一 引用 在转换 函数中 被修改
        styleConfig[targetElementInfo.configIndex].cssAttribute =
          cloneDeep(values)
      }
      // 找不到 下标 就插入
      else {
        styleConfig.push({
          styleNodeId,
          selector,
          cssAttribute: cloneDeep(values),
        })
      }

      // 更新 store
      editerDataDispatch({
        type: EditerDataActionEnum.UPDATE_STYLE_CONFIG,
        payload: [...styleConfig],
      })

      // 转换 为 可识别的 css 样式表
      // 转换 后  更新到 css
      const transformed = composedValuesTransformer(values)

      // 更新节点 样式
      updateTargetElementStyleNode(styleNodeId, selector, transformed)
    }
  }

  const handleResetStyle = () => {
    styleConfigForm.resetFields()

    removeStyleNode(targetElementInfo.styleNodeId)
    // 删除 store 中存储 的对应项
    if (targetElementInfo.configIndex > -1 && styleConfig) {
      styleConfig.splice(targetElementInfo.configIndex, 1)
      editerDataDispatch({
        type: EditerDataActionEnum.UPDATE_STYLE_CONFIG,
        payload: [...styleConfig],
      })
    }
  }

  // 更新 form
  React.useEffect(() => {
    // 能找到
    if (targetElementInfo.configIndex > -1) {
      styleConfigForm.setFieldsValue(
        styleConfig?.[targetElementInfo.configIndex].cssAttribute
      )
    }
    // 找不到 - 重置 表单
    else {
      styleConfigForm.resetFields()
    }
  }, [targetElementInfo, styleConfigForm, styleConfig])

  return (
    <CollapseItem header="样式配置" name="style_config" disabled={!active}>
      <Collapse {...COLLAPSE_BASE_PROPS}>
        <Form
          size="small"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 17,
          }}
          labelAlign="left"
          form={styleConfigForm}
          onChange={handleChange}
          autoComplete="off"
        >
          <CollapseItem header="布局" name="style_config.layout">
            <LayoutForm />
          </CollapseItem>
          <CollapseItem header="文字" name="style_config.font">
            <FontForm
              usedFontList={usedFontList}
              customPalette={globalConfig?.customPalette}
            />
          </CollapseItem>
          <CollapseItem header="背景" name="style_config.background">
            <BackgroundForm
              // 忽略 对于 FormInstance 的类型检测
              // @ts-ignore
              styleConfigForm={styleConfigForm}
              customPalette={globalConfig?.customPalette}
            />
          </CollapseItem>
          <CollapseItem header="边框" name="style_config.border">
            <BorderForm customPalette={globalConfig?.customPalette} />
          </CollapseItem>
        </Form>
      </Collapse>
      <Divider className={styles.divider} />
      <Button
        type="secondary"
        onClick={handleResetStyle}
        style={{ width: '100%' }}
      >
        重置样式
      </Button>
    </CollapseItem>
  )
}

export default StyleConfig
