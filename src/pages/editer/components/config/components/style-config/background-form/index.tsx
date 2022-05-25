import * as React from 'react'

import {
  Form,
  Button,
  Grid,
  Tooltip,
  Link,
  Empty,
  Switch,
} from '@arco-design/web-react'
import { FormInstance } from '@arco-design/web-react/lib/Form/interface'
import {
  IconDelete,
  IconArrowRise,
  IconEdit,
  IconArrowFall,
  IconQuestionCircle,
} from '@arco-design/web-react/icon'

import { BLEND_MODE_DOC_HREF } from '@/common/constant'
import { BlendModeSelect } from '@/components/custom-form-inner/simple'
import CustomColorPicker from '@/components/custom-color-picker'
import CustomImage from '@/components/custom-image'

import styles from './index.module.less'
import OperatePopover from './operate-popover'

const { Item: FormItem, List: FormList } = Form
const { Col, Row } = Grid

export type BackgroundFormProps = {
  customPalette?: string[]
  styleConfigForm: FormInstance
}

// formItems 联动 渲染
const foformItemsLinkRenderer = (values: any) => {
  if (!values.backgrounds || values.backgrounds?.length === 0) {
    return <Empty />
  }
  if (values.backgrounds?.length > 1) {
    return (
      <FormItem
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        label={
          <span>
            层叠模式
            <Tooltip
              content={
                <span>
                  多个图片、背景色之间重叠时如何计算色值
                  <Link
                    href={BLEND_MODE_DOC_HREF}
                    target="_blank"
                    hoverable={false}
                  >
                    更多
                  </Link>
                </span>
              }
            >
              <IconQuestionCircle className="question_icon" />
            </Tooltip>
          </span>
        }
        field="background_blend_mode"
      >
        <BlendModeSelect />
      </FormItem>
    )
  }
  return null
}

const BackgroundForm: React.FC<BackgroundFormProps> = (props) => {
  const { styleConfigForm, customPalette } = props

  const [popupVisible, setVisible] = React.useState(false)
  const [operateForm] = Form.useForm()
  const currentOprateBgValueRef = React.useRef('')
  const currentOprateIndexRef = React.useRef(-1)

  const [changeSaved, setSaved] = React.useState(false)

  const showPopup = () => {
    setVisible(true)
  }

  const hidePopup = () => {
    currentOprateIndexRef.current = -1
    operateForm.resetFields()
    setVisible(false)
  }

  const setSavedFalse = () => {
    setSaved(false)
  }

  const operateOne = (index: number) => {
    const styleConfigFormValues = styleConfigForm.getFieldsValue()
    const targetItem = styleConfigFormValues.backgrounds?.[index]
    // 记录 正在操作的 下标
    currentOprateIndexRef.current = index
    if (targetItem?.background_type === 'image')
      operateForm.setFieldsValue({
        image: targetItem,
      })

    showPopup()
  }

  const getBackgroundFromStyleConfigForm = React.useCallback(
    (index: number) => {
      const styleConfigFormValues = styleConfigForm.getFieldsValue()
      const targetItem = styleConfigFormValues.backgrounds?.[index]
      // MARK: 临时 先取  url
      // NOTE: FormList 的渲染时机 似乎 早于 change 事件，最新的一项  拿不到
      return targetItem?.url || currentOprateBgValueRef.current
    },
    [styleConfigForm]
  )

  return (
    <div>
      <FormItem
        label="背景色"
        field="background_color"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <CustomColorPicker allowClear presetColors={customPalette} />
      </FormItem>
      <FormItem label="图片" labelCol={{ span: 8 }} />
      <FormList field="backgrounds">
        {(fields, { remove, move }) => (
          <div>
            {fields.map((item, index) => (
              <Row gutter={4} key={item.field}>
                <Col span={16}>
                  <Form.Item
                    field={item.field}
                    label={`第${index + 1}项`}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <CustomImage
                      width={20}
                      height={20}
                      src={getBackgroundFromStyleConfigForm(index)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <div className={styles.operate_btns}>
                    <Button
                      size="mini"
                      icon={<IconDelete />}
                      shape="circle"
                      status="danger"
                      onClick={() => {
                        remove(index)
                        setSavedFalse()
                      }}
                    />
                    <Button
                      size="mini"
                      shape="circle"
                      onClick={() => {
                        move(index, index > 0 ? index - 1 : index + 1)
                        setSavedFalse()
                      }}
                    >
                      {index > 0 ? <IconArrowRise /> : <IconArrowFall />}
                    </Button>
                    <Button
                      size="mini"
                      icon={<IconEdit />}
                      shape="circle"
                      type="primary"
                      onClick={() => operateOne(index)}
                    />
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        )}
      </FormList>
      <Form.Item shouldUpdate noStyle>
        {foformItemsLinkRenderer}
      </Form.Item>
      <OperatePopover
        visible={popupVisible}
        // 忽略 对于 FormInstance 的类型检测
        // @ts-ignore
        operateForm={operateForm}
        styleConfigForm={styleConfigForm}
        currentOprateBgValueRef={currentOprateBgValueRef}
        currentOprateIndexRef={currentOprateIndexRef}
        onShow={showPopup}
        onHide={hidePopup}
        setSavedFalse={setSavedFalse}
      />
      <FormItem
        label={
          <span>
            保存变更
            <Tooltip content="更新背景后需要手动保存">
              <IconQuestionCircle className="question_icon" />
            </Tooltip>
          </span>
        }
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        shouldUpdate
        field="change_saved"
      >
        <Switch
          size="default"
          checkedText="saved"
          uncheckedText="unsaved"
          checked={changeSaved}
          onChange={setSaved}
        />
      </FormItem>
    </div>
  )
}

export default BackgroundForm
