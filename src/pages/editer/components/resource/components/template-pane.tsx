import * as React from 'react'

import {
  Input,
  Grid,
  Form,
  Spin,
  Card,
  Empty,
  Divider,
  Button,
  FormProps,
} from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import clsx from 'clsx'
import {
  TemplateTypeSelect,
  TemplateOrderSelect,
} from '@/components/template-type-selector'
import CustomImage from '@/components/custom-image'
import { GetTemplateListRes, GetResourceListQuery } from '@/typings/request'
import { getTemplateList } from '@/network/resource'
import { dispatchTemplateImportEvent } from '@/common/utils'

import styles from './index.module.less'

const { Search } = Input

const { Row, Col } = Grid

const { Item: FormItem } = Form

type QueryForm = {
  filter: GetResourceListQuery['filter']
  order: GetResourceListQuery['order']
  titleLike?: string
}

const initialQuery: QueryForm = {
  filter: 'all',
  order: 'lastModified',
}

const TemplatePane = () => {
  const [paginationInfo, setPagination] = React.useState<{
    current: number
    size: number
  }>({ current: 1, size: 10 })

  const [queryForm] = Form.useForm<QueryForm>()

  const [templateListRes, setPageList] = React.useState<GetTemplateListRes>({
    resourceList: [],
    hasMore: 0,
  })
  const [loading, setLoading] = React.useState(false)

  const triggerElementRef = React.useRef(null)

  const fetchTemplateList = React.useCallback(() => {
    const values = queryForm.getFieldsValue(['titleLike', 'filter', 'order'])
    const { current, size } = paginationInfo
    const offset = (current - 1) * size

    setLoading(true)
    getTemplateList({
      offset,
      limit: size,
      ...values,
    })
      .then((res) => {
        if (res.success) {
          setPageList(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [paginationInfo, queryForm])

  const hanldeLoadMore = React.useCallback(() => {
    if (!templateListRes.hasMore) return
    setPagination(({ current, size }) => ({
      size,
      current: current + 1,
    }))
  }, [templateListRes.hasMore])

  const handleFormChange: FormProps<QueryForm>['onChange'] = (value) => {
    // 不是 输入框的变化 引起的 才触发请求
    if (!value.titleLike) {
      fetchTemplateList()
    }
  }

  const generateImportHandler = (resourceId: string) => () => {
    dispatchTemplateImportEvent(resourceId)
  }

  React.useEffect(() => {
    fetchTemplateList()
  }, [fetchTemplateList])

  // 加载更多
  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    const triggerElement = triggerElementRef.current
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const { intersectionRatio } = entries[0]
      // 排除 triggerElement 一开始 就可见的情况，很常见
      if (intersectionRatio !== 1) {
        hanldeLoadMore()
      }
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5, // 交叉比例 超过 0.5 才触发
    })
    if (triggerElement) {
      observer.observe(triggerElement)
      return () => {
        // 停止观察
        observer.unobserve(triggerElement)
      }
    }
  }, [hanldeLoadMore])

  return (
    <div className={styles.resource_pane}>
      <Form
        form={queryForm}
        className={styles.filter_wrapper}
        initialValues={initialQuery}
        labelAlign="left"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        onChange={handleFormChange}
      >
        <FormItem noStyle field="titleLike">
          <Search
            searchButton
            placeholder="输入关键词进行模糊查询"
            style={{ width: '90%' }}
            size="small"
            onSearch={fetchTemplateList}
          />
        </FormItem>
        <Row className={styles.filter} gutter={10}>
          <Col className="type" span={12}>
            <FormItem field="filter" label="分类">
              <TemplateTypeSelect size="small" />
            </FormItem>
          </Col>
          <Col className="type" span={12}>
            <FormItem field="order" label="排序">
              <TemplateOrderSelect size="small" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <h4 className={styles.section_title}>模板列表</h4>
      <Spin style={{ display: 'block' }} loading={loading}>
        <div className={styles.resources_list}>
          {templateListRes.resourceList.map(
            ({ thumbnailUrl, title, resourceId }) => (
              <Card
                hoverable
                cover={
                  <div className={styles.template_cover}>
                    <CustomImage
                      src={thumbnailUrl}
                      height={80}
                      width="100%"
                      preview={false}
                      className={styles.resource_cover}
                    />
                    <Button
                      className={styles.template_import_btn}
                      size="mini"
                      type="primary"
                      icon={<IconPlus />}
                      onClick={generateImportHandler(resourceId)}
                    >
                      引入
                    </Button>
                  </div>
                }
                className={styles.resource_card}
                key={resourceId}
              >
                {title}
              </Card>
            )
          )}
        </div>
        {templateListRes.resourceList.length === 0 && <Empty />}
        <Divider
          className={clsx(styles.load_trigger, 'load_trigger')}
          ref={triggerElementRef}
        >
          <span className="tip_text">我也是有底线的</span>
        </Divider>
      </Spin>
    </div>
  )
}

export default TemplatePane
