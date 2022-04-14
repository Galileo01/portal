import * as React from 'react'

import { Collapse, Form, Input, Button, Popover } from '@arco-design/web-react'
import { IconPlusCircle } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { FontFamily } from '@/@types/portal-network'

import { FontLanguageSelect } from '@/components/custom-form-inner/simple'
import { devLogger } from '@/common/utils'
import { useFetchDataStore } from '@/store/fetch-data'

import FontForm from '../font-form'
import styles from './index.module.less'

const { Item: CollapseItem } = Collapse
const { Item: FormItem } = Form

const FontConfig = () => {
  const { allFontList } = useFetchDataStore()

  const [fontList, setFontList] = React.useState(allFontList)
  const [addForm] = Form.useForm<FontFamily>()
  const [popupVisible, setVisible] = React.useState(false)

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
    <CollapseItem header="字体配置" name="global_config.font-config">
      <div className={styles.form_tip}>
        <span className="tip_text">
          点击
          <Popover
            popupVisible={popupVisible}
            className={styles.add_form_popover}
            content={
              <div>
                <div className={styles.popover_title}>添加字体</div>
                <Form
                  autoComplete="off"
                  size="small"
                  form={addForm}
                  labelCol={{
                    span: 7,
                  }}
                  wrapperCol={{
                    span: 11,
                  }}
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
                    <FontLanguageSelect />
                  </FormItem>
                  <FormItem field="src" label="引用链接">
                    <Input allowClear />
                  </FormItem>
                </Form>
                <div className={styles.copyright_warning}>
                  注意:输入链接之前请确保可以合法使用，本平台不对版权造成的问题负责
                </div>
                <div className={styles.btns}>
                  <Button onClick={hideModal}>取消</Button>
                  <Button type="primary" onClick={handleConfirm}>
                    确认并添加
                  </Button>
                </div>
              </div>
            }
          >
            <IconPlusCircle
              className={clsx(styles.add_icon, 'portal_tip_icon')}
              onClick={showModal}
            />
          </Popover>
          自己添加字体
        </span>
      </div>
      <FontForm fontList={fontList} />
    </CollapseItem>
  )
}

export default FontConfig
