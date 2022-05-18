import * as React from 'react'

import {
  Form,
  Button,
  Message,
  List,
  Image,
  Collapse,
  FormProps,
} from '@arco-design/web-react'
import { IconSave } from '@arco-design/web-react/icon'
import { FontList } from '@/typings/database'
import FontCascader from '@/components/custom-form-inner/font-cascader'
import { FontFormData } from '@/typings/common/editer-config-data'
import {
  filterFontByType,
  updateFontConfigToElement,
} from '@/common/utils/font'
import { useGlobalConfig } from '@/common/hooks/editer-data'
import HelpTip from '@/components/help-tip'

import styles from './index.module.less'
import { COLLAPSE_BASE_PROPS } from '../../../config'

export type FontFormProps = {
  /**
   * @fontList 接口返回的 所有 字体列表
   */
  fontList: FontList
}

const { Item: FormItem } = Form
const { Item: ListItem } = List
const { Meta: ListItemMeta } = ListItem
const { Item: CollapseItem } = Collapse

const FontForm: React.FC<FontFormProps> = ({ fontList }) => {
  const { configData, updateGlobalConfig } = useGlobalConfig()

  const [fontForm] = Form.useForm<FontFormData>()

  const platFormFontList = React.useMemo(
    () => filterFontByType(fontList, 'platform_provide'),
    [fontList]
  )

  const handleFormChangeHandler: FormProps<FontFormData>['onChange'] = (
    value,
    values
  ) => {
    // 更新 的字段不是  globalFont
    if (!value.globalFont) return
    const [, globalFont] = value.globalFont
    const usedFont = values.usedFont || []
    const containIndex = usedFont.findIndex((item) => item[1] === globalFont)
    //  不包含
    if (containIndex < 0) {
      usedFont.unshift(value.globalFont) // 全局字体默认 始终 保持在 第一个位置

      fontForm.setFieldValue('usedFont', usedFont)
    }
  }

  const handleSaveClick = () => {
    updateFontConfigToElement(fontForm.getFieldsValue(), fontList, true)

    updateGlobalConfig({
      fontConfig: fontForm.getFieldsValue(),
    })

    Message.success('字体配置保存成功')
  }

  return (
    <section className={styles.font_form}>
      <Form
        form={fontForm}
        size="small"
        labelCol={{
          span: 9,
        }}
        wrapperCol={{
          span: 15,
        }}
        labelAlign="left"
        onChange={handleFormChangeHandler}
        className={styles.font_form}
        initialValues={configData?.fontConfig}
      >
        <FormItem field="globalFont" label="全局字体">
          <FontCascader fontList={fontList} />
        </FormItem>
        <FormItem
          field="usedFont"
          label={
            <span>
              使用的字体
              <HelpTip content="包含全局字体和单个元素个性化字体" />
            </span>
          }
        >
          <FontCascader fontList={fontList} mode="multiple" />
        </FormItem>
        <Button
          icon={<IconSave />}
          type="primary"
          style={{
            width: '100%',
          }}
          onClick={handleSaveClick}
        />
      </Form>
      <Collapse {...COLLAPSE_BASE_PROPS}>
        <CollapseItem
          header={<div className="tip_text">平台提供的免费商用字体如下</div>}
          name="font_list"
        >
          <List size="small" className={styles.list}>
            {platFormFontList.map((font) => (
              <ListItem key={font.name}>
                <ListItemMeta
                  avatar={
                    <Image src={font.previewImg} height={50} width={50} />
                  }
                  title={font.name}
                  description={font.mainLanguage}
                />
              </ListItem>
            ))}
          </List>
        </CollapseItem>
      </Collapse>
    </section>
  )
}

export default FontForm
