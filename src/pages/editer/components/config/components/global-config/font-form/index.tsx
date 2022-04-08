import * as React from 'react'

import {
  Form,
  Cascader,
  Button,
  Message,
  Tooltip,
  List,
  Image,
  Collapse,
  FormProps,
} from '@arco-design/web-react'
import { IconQuestionCircle, IconSave } from '@arco-design/web-react/icon'
import { FontList } from '@/@types/portal-network'

import { devLogger } from '@/common/utils'
import { createFontStyleNode } from '@/common/utils/font'
import { useGlobalConfig } from '@/common/hooks/editer-data'
import { FontFormData } from '@/typings/common/editer-config-data'

import styles from './index.module.less'
import { computeCascaderOptions, filterFontByType } from './utils'

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
  const { configData, updateGlobalConfig } = useGlobalConfig('font')

  const [fontForm] = Form.useForm<FontFormData>()

  const options = React.useMemo(
    () => computeCascaderOptions(fontList),
    [fontList]
  )

  const platFormFontList = React.useMemo(
    () => filterFontByType(fontList, 'platform_provide'),
    [fontList]
  )

  const handleFormChangeHandler: FormProps<FontFormData>['onValuesChange'] = (
    value,
    values
  ) => {
    devLogger('handleFormChangeHandler', value, values)

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
    const usedFontName =
      fontForm.getFieldsValue(['usedFont']).usedFont?.map((item) => item[1]) ||
      []

    const usedFont = fontList.filter(
      (font) => font.src && usedFontName.includes(font.name)
    )
    createFontStyleNode(usedFont)

    updateGlobalConfig({
      fontConfig: fontForm.getFieldsValue(),
    })

    Message.success('字体配置保存成功')
  }

  return (
    <section className={styles.font_form}>
      <Form
        form={fontForm}
        labelCol={{
          span: 9,
        }}
        wrapperCol={{
          span: 15,
        }}
        labelAlign="left"
        onChange={handleFormChangeHandler}
        className={styles.font_form}
        initialValues={configData}
      >
        <FormItem field="globalFont" label="全局字体">
          <Cascader
            options={options}
            allowClear
            renderFormat={(valueShow) => valueShow[1]}
            fieldNames={{
              label: 'name',
              value: 'name',
            }}
          />
        </FormItem>
        <FormItem
          field="usedFont"
          label={
            <span>
              使用的字体
              <Tooltip content="包含全局字体和单个元素个性化字体">
                <IconQuestionCircle className={styles.ques_icon} />
              </Tooltip>
            </span>
          }
        >
          <Cascader
            options={options}
            mode="multiple"
            allowClear
            renderFormat={(valueShow) => valueShow[1]}
            fieldNames={{
              label: 'name',
              value: 'name',
            }}
          />
        </FormItem>
        <Button
          icon={<IconSave />}
          style={{
            width: '100%',
          }}
          onClick={handleSaveClick}
        />
      </Form>
      <Collapse lazyload bordered={false} expandIconPosition="right" accordion>
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
