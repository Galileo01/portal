import * as React from 'react'

import { Card, Image } from '@arco-design/web-react'

import { componentCategoryList } from '@/resource-components'
import { devLogger } from '@/common/utils'
import { DATASET_KEY_RESOURCE_COMPONENT_KEY } from '@/common/constant'

import styles from './index.module.less'

const ComponentPane = () => {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    const componentKey = (e.target as HTMLElement).dataset[
      DATASET_KEY_RESOURCE_COMPONENT_KEY
    ]
    e.dataTransfer.setData(
      DATASET_KEY_RESOURCE_COMPONENT_KEY,
      componentKey || ''
    )
    devLogger('ComponentPane', 'handleDragStart', e.target, componentKey)
  }

  return (
    <section className={styles.component_pane}>
      <div className={styles.content} onDragStart={handleDragStart}>
        {componentCategoryList.map(({ cate, label, componentList }) => (
          <div className={styles.cate_item} key={cate}>
            <h4 className={styles.category_title}>{label}</h4>
            <div className={styles.components_list}>
              {componentList.map(({ previewImg, name, key }) => (
                <Card
                  hoverable
                  cover={
                    <Image
                      src={previewImg}
                      alt={name}
                      height={80}
                      width="100%"
                      className={styles.component_cover}
                      preview={false}
                    />
                  }
                  className={styles.component_card}
                  key={key}
                  draggable
                  // data-key 请和  @/common/constant 下  DATASET_KEY_RESOURCE_COMPONENT_KEY 常量 保持一致
                  data-resource_component_key={key}
                >
                  {name}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ComponentPane
