import * as React from 'react'

import { Collapse, Form, Select, Modal, Input } from '@arco-design/web-react'
import { IconPlusCircle } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { FontFamily } from '@/@types/portal-network'

import { devLogger } from '@/common/utils'
import { fontList as initialFontList } from '@/mock/fontList'

import FontForm from '../font-form'
import styles from './index.module.less'

const { Item: CollapseItem } = Collapse
const { Item: FormItem } = Form

const languageOptions = [
  {
    label: '中文',
    value: 'ch',
  },
  {
    label: '英文',
    value: 'en',
  },
]

const FontConfig = () => {
  const [fontList, setFontList] = React.useState(initialFontList)
  const [addForm] = Form.useForm<FontFamily>()
  const [modalVisible, setVisible] = React.useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    addForm.resetFields()
  }

  const handleConfirm = () => {
    addForm.validate((errors, values) => {
      if (!errors && values) {
        const formData = addForm.getFieldsValue()
        const { name, src, mainLanguage } = formData
        devLogger('handleConfirm', 'addForm', formData)

        setFontList((pre) => {
          pre.push({
            name: name!,
            src,
            mainLanguage,
            type: 'user_add',
          })
          return [...pre]
        })
        hideModal()
      }
    })
  }

  return (
    <CollapseItem header="字体配置" name="page_config.font-config">
      <div className={styles.form_tip}>
        <span className="tip_text">
          点击
          <IconPlusCircle
            className={clsx(styles.add_icon, 'portal_tip_icon')}
            onClick={showModal}
          />
          自己添加字体
        </span>
      </div>
      <FontForm fontList={fontList} />
      <Modal
        title="添加字体"
        okText="确认并添加"
        visible={modalVisible}
        onCancel={hideModal}
        onConfirm={handleConfirm}
      >
        <Form
          form={addForm}
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 11,
          }}
          // initialValues={configData}
        >
          <FormItem
            field="name"
            label="字体名称"
            rules={[
              {
                required: true,
                message: '请输入字体名称',
              },
            ]}
          >
            <Input allowClear />
          </FormItem>
          <FormItem field="mainLanguage" label="适用语言">
            <Select options={languageOptions} allowClear />
          </FormItem>

          <FormItem field="src" label="引用链接">
            <Input allowClear />
          </FormItem>
          <FormItem noStyle>
            <div className={styles.copyright_warning}>
              注意:输入链接之前请确保可以合法使用，本平台不对版权造成的问题负责
            </div>
          </FormItem>
        </Form>
      </Modal>
    </CollapseItem>
  )
}

export default FontConfig
