import * as React from 'react'

import {
  Form,
  Input,
  Button,
  Grid,
  Popover,
  Tabs,
} from '@arco-design/web-react'
import { FormInstance } from '@arco-design/web-react/lib/Form/interface'

import {
  PxInputNumber,
  BackgroundRepeatSelect,
  BackgroundSizeSelect,
  BackgroundClipSelect,
  BackgroundAttachmentSelect,
} from '@/components/custom-form-inner/simple'
import { devLogger } from '@/common/utils'
import { FormDataGenerator } from '@/typings/common/editer-config-data'

import styles from './index.module.less'

const { Item: FormItem } = Form
const { TabPane } = Tabs
const { Col, Row } = Grid

export type OprateTabKey = 'image' | 'linear_gradient' | 'radial_gradient'

export const operateTabName: {
  [key: string]: string
} = {
  image: '图片',
  linear_gradient: '线性渐变',
  radial_gradient: '径向渐变',
}

export type OperatePopoverProps = {
  visible: boolean
  operateForm: FormInstance
  styleConfigForm: FormInstance
  currentOprateIndexRef: React.MutableRefObject<number>
  currentOprateBgValueRef: React.MutableRefObject<string>
  onShow: () => void
  onHide: () => void
  setSavedFalse: () => void
}

export type Backgrounds = Array<
  {
    background_type: OprateTabKey
  } & FormDataGenerator<
    | 'url'
    | 'background_size'
    | 'background_repeat'
    | 'background_clip'
    | 'background_attachment',
    string
  >
>

const OperatePopover: React.FC<OperatePopoverProps> = (props) => {
  const {
    visible,
    styleConfigForm,
    operateForm,
    currentOprateBgValueRef,
    currentOprateIndexRef,
    onShow,
    onHide,
    setSavedFalse,
  } = props

  const [currentTab, setTab] = React.useState<OprateTabKey>('image')
  const [changed, setChanged] = React.useState(false)

  const handleConfirmClick = () => {
    if (!changed) {
      devLogger('handleConfirmClick', 'dont changed')
      onHide()
      return
    }
    const operateFormValues = operateForm.getFieldsValue()
    const { backgrounds = [], ...rest } = styleConfigForm.getFieldsValue()
    devLogger(
      'BackgroundForm',
      'handleConfirmClick',
      'operateForm',
      operateFormValues,
      'styleConfigForm backgrounds',
      backgrounds
    )

    if (currentTab === 'image' && operateFormValues?.image?.url) {
      const newItem = {
        ...operateFormValues.image,
        background_type: 'image',
      }
      //  currentOprateIndexRef 下标 有意义 - 修改
      if (currentOprateIndexRef.current > -1) {
        backgrounds[currentOprateIndexRef.current] = newItem
      }
      // 否则 插入 新的item
      else {
        backgrounds.push(newItem)
      }

      currentOprateBgValueRef.current = operateFormValues.image.url
    }

    styleConfigForm.setFieldsValue({
      ...rest,
      backgrounds,
      //  保存变更 切换到 false
      // change_saved: false,
    })

    setSavedFalse()
    onHide()
  }

  const handleTabChange = (key: string) => {
    setTab(key as OprateTabKey)
  }

  const handleFormChange = () => {
    setChanged(true)
  }

  const PopupContent = (
    <Form
      // 忽略 对于 FormInstance 的类型检测
      // @ts-ignore
      form={operateForm}
      size="small"
      className={styles.operate_form}
      labelAlign="left"
      labelCol={{ span: 9 }}
      wrapperCol={{ span: 15 }}
      onChange={handleFormChange}
    >
      <Tabs type="text" activeTab={currentTab} onChange={handleTabChange}>
        <TabPane title={operateTabName.image} key="image">
          <FormItem label="链接" field="image.url">
            <Input allowClear />
          </FormItem>
          <FormItem label="尺寸" field="image.background_size">
            <BackgroundSizeSelect />
          </FormItem>
          <FormItem label="重复方式" field="image.background_repeat">
            <BackgroundRepeatSelect />
          </FormItem>
          <FormItem label="延伸区域" field="image.background_clip">
            <BackgroundClipSelect />
          </FormItem>
          <FormItem label="滚动吸附" field="image.background_attachment">
            <BackgroundAttachmentSelect />
          </FormItem>
        </TabPane>
        <TabPane title={operateTabName.linear_gradient} key="linear_gradient">
          <FormItem label="测试字段" field="linear-gradient.text-field">
            <PxInputNumber />
          </FormItem>
        </TabPane>
        <TabPane title={operateTabName.radial_gradient} key="radial_gradient" />
      </Tabs>
      <Row justify="end">
        <Col span={6}>
          <Button
            type="secondary"
            className={styles.cancel_btn}
            onClick={onHide}
          >
            取消
          </Button>
        </Col>
        <Col span={6}>
          <Button type="outline" onClick={handleConfirmClick}>
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Popover content={PopupContent} popupVisible={visible} position="bottom">
      <Button style={{ width: '100%', margin: '10px 0' }} onClick={onShow}>
        添加图片或渐变
      </Button>
    </Popover>
  )
}

export default OperatePopover
