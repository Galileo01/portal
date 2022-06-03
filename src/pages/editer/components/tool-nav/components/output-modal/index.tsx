import * as React from 'react'

import {
  Modal,
  Form,
  Input,
  Switch,
  Spin,
  Radio,
  ModalProps,
} from '@arco-design/web-react'

import HelpTip from '@/components/help-tip'
import { devLogger } from '@/common/utils'
import { CodeOutputData } from '@/typings/request'
import { EditType } from '@/typings/common/editer'
import { useFetchDataStore } from '@/store/fetch-data'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

export type OutputForm = {
  pageId: string
  title: string
  type: CodeOutputData['type']
  useLocal: boolean
}

export type OutputModalProps = Omit<ModalProps, 'onConfirm'> & {
  pageId: string
  editType: string
  fetching: boolean
  onConfirm: (values: OutputForm) => void
}

const OutputModal: React.FC<OutputModalProps> = (props) => {
  const { visible, pageId, editType, fetching, onConfirm, ...restProps } = props

  const useFetchData = useFetchDataStore()

  const [outputForm] = Form.useForm<OutputForm>()

  const isEditTypeCreate = editType === EditType.CREATE

  const initialValues = React.useMemo<OutputForm>(
    () => ({
      pageId,
      title: useFetchData.resource?.title || pageId,
      type: 'src_code',
      useLocal: isEditTypeCreate,
    }),
    [pageId, useFetchData.resource, isEditTypeCreate]
  )

  const handleSubmitClick = () => {
    outputForm.validate((errors, values) => {
      if (!errors && values) {
        onConfirm(values)
      } else {
        devLogger('handleSubmitClick error', values)
      }
    })
  }

  React.useEffect(() => {
    if (!visible) {
      outputForm.setFieldsValue(initialValues)
    }
  }, [outputForm, visible, initialValues])

  return (
    <Modal
      {...restProps}
      title="出码"
      visible={visible}
      onConfirm={handleSubmitClick}
    >
      <Spin loading={fetching} dot tip="出码中..." style={{ display: 'block' }}>
        <Form
          form={outputForm}
          wrapperCol={{ span: 12 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
          autoComplete="off"
          size="small"
        >
          <FormItem
            field="pageId"
            label="页面id"
            defaultValue={pageId}
            disabled
          >
            <Input />
          </FormItem>
          <FormItem
            field="title"
            label="页面名称"
            rules={[
              {
                required: true,
                message: '请填写页面名称',
              },
              {
                maxLength: 20,
                message: '最大长度为20',
              },
            ]}
          >
            <Input allowClear />
          </FormItem>
          <FormItem
            field="type"
            label={
              <>
                出码类型
                <HelpTip
                  content={
                    <>
                      <p>源码:基于React的前端项目,可进行二次开发</p>
                      <p>构建后:构建后的静态文件，可直接部署</p>
                    </>
                  }
                />
              </>
            }
          >
            <RadioGroup>
              <Radio value="src_code">源码</Radio>
              <Radio value="builded">构建后</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            field="useLocal"
            triggerPropName="checked"
            label={
              <>
                本地数据
                <HelpTip content="使用编辑器数据进行出码；注:创建模式下强制开启" />
              </>
            }
          >
            <Switch disabled={isEditTypeCreate} />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

export default OutputModal
