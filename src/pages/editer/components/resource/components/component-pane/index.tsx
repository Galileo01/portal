import * as React from 'react'

import { Card, Image } from '@arco-design/web-react'

import { navCateComponents } from '@/resource-components'
import { devLogger } from '@/common/utils'
import { DATASET_KEY_COMPONENT_KEY } from '@/common/constant'

import styles from './index.module.less'

const ComponentPane = () => {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    const componentKey = (e.target as HTMLElement).dataset[
      DATASET_KEY_COMPONENT_KEY
    ]
    e.dataTransfer.setData(DATASET_KEY_COMPONENT_KEY, componentKey || '')
    devLogger('ComponentPane', 'handleDragStart', componentKey)
  }

  return (
    <section className={styles.component_pane}>
      <div className={styles.content} onDragStart={handleDragStart}>
        <h4 className={styles.category_title}>导航</h4>
        <div className={styles.components_list}>
          {navCateComponents.map(({ previewImg, name, key }) => (
            <Card
              hoverable
              cover={
                <Image
                  src={previewImg}
                  alt={name}
                  height={80}
                  width="100%"
                  className={styles.component_cover}
                  draggable={false}
                  preview={false}
                />
              }
              className={styles.component_card}
              key={key}
              draggable
              data-component_key={key}
            >
              {name}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ComponentPane
