import * as React from 'react'

import { Form, Switch } from '@arco-design/web-react'

import {
  CustomNumberInput,
  PxInputNumber,
} from '@/components/custom-form-inner/simple'

import ItemsRow from '../items-row'
import styles from './index.module.less'

const { Item: FormItem } = Form

// 分离 各个方向 的边距
const simulaterBox = (
  <div className={styles.simulater_box}>
    <div className={styles.margin_top}>
      <FormItem noStyle field="margin_top">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.margin_right}>
      <FormItem noStyle field="margin_right">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.margin_bottom}>
      <span className={styles.attr_text}>外边距</span>
      <FormItem noStyle field="margin_bottom">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.margin_left}>
      <FormItem noStyle field="margin_left">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.padding_top}>
      <FormItem noStyle field="padding_top">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.padding_right}>
      <FormItem noStyle field="padding_right">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.padding_bottom}>
      <span className={styles.attr_text}>内边距</span>
      <FormItem noStyle field="padding_bottom">
        <CustomNumberInput />
      </FormItem>
    </div>
    <div className={styles.padding_left}>
      <FormItem noStyle field="padding_left">
        <CustomNumberInput />
      </FormItem>
    </div>
  </div>
)

// 统一 边距 缩写
const shorthand = (
  <>
    <FormItem label="内边距" field="padding">
      <PxInputNumber />
    </FormItem>
    <FormItem label="外边距" field="margin">
      <PxInputNumber />
    </FormItem>
  </>
)

// 表单 联动 渲染
const foformItemsLinkRenderer = (values: any) =>
  values.mp_separate ? simulaterBox : shorthand

const LayoutForm = () => (
  <div>
    <FormItem label="分离边距" field="mp_separate" labelCol={{ span: 7 }}>
      <Switch />
    </FormItem>
    <FormItem noStyle shouldUpdate>
      {foformItemsLinkRenderer}
    </FormItem>
    <div>
      <ItemsRow
        left={
          <FormItem label="高度" field="height">
            <PxInputNumber />
          </FormItem>
        }
        right={
          <FormItem label="宽度" field="width">
            <PxInputNumber />
          </FormItem>
        }
      />
    </div>
  </div>
)

export default LayoutForm
