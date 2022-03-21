export type ResourceComponent = {
  name: string
  key: string
  category: string
  previewImg: string
  component: () => JSX.Element
}
