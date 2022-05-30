import * as React from 'react'

import { Form, Input, Button, Grid, Popover } from '@arco-design/web-react'
import { FormInstance } from '@arco-design/web-react/lib/Form/interface'

import {
  BackgroundRepeatSelect,
  BackgroundSizeSelect,
  BackgroundClipSelect,
  BackgroundAttachmentSelect,
} from '@/components/custom-form-inner/simple'

import styles from './index.module.less'

const { Item: FormItem } = Form
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

  const [currentTab] = React.useState<OprateTabKey>('image')
  const [changed, setChanged] = React.useState(false)

  const handleConfirmClick = () => {
    if (!changed) {
      onHide()
      return
    }
    const operateFormValues = operateForm.getFieldsValue()
    const { backgrounds = [], ...rest } = styleConfigForm.getFieldsValue()

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
      //  保存变更 强制 切换到 false
      change_saved: false,
    })

    setSavedFalse()
    onHide()
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
        添加图片
      </Button>
    </Popover>
  )
}

export default OperatePopover
