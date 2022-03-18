export type Component = {
  name: string
  id: string
  children: Component[]
}

export type EditerData = {
  componentTree: Component[]
  currentComponent?: Component
}
