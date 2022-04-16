import * as React from 'react'

import { Grid, RowProps } from '@arco-design/web-react'

import styles from './index.module.less'

const { Row, Col } = Grid

export type ItemsRowProps = {
  left: JSX.Element
  right: JSX.Element
  gutter?: RowProps['gutter']
}

const ItemsRow: React.FC<ItemsRowProps> = ({ left, right, gutter }) => (
  <Row className={styles.items_row} gutter={gutter}>
    <Col span={12}>{left}</Col>
    <Col span={12}>{right}</Col>
  </Row>
)

export default ItemsRow
