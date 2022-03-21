import React from 'react'

import { Input } from '@arco-design/web-react'

import styles from './index.module.less'

const InputSearch = Input.Search

const ComponentPane = () => (
  <section className={styles.component_pane}>
    <InputSearch searchButton placeholder="search components" />
  </section>
)

export default ComponentPane
