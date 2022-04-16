// 主题配置
export type StringKeyValueObject = Record<string, string>

export type ColorVarValue = StringKeyValueObject

export type ColorVarMap = Record<
  string,
  {
    label: string
    varKey: string
  }
>

export type ThemeConfigData = ColorVarValue

// 字体配置
export type FontFormData = {
  globalFont: string[]
  usedFont: string[][]
}

export type FontConfigData = Partial<FontFormData>

// 全局配置
export type GlobalConfig = {
  // 主题配置 - 颜色变量
  themeConfig?: ThemeConfigData
  // 个性 调色板
  customPalette?: string[]
  // 字体配置
  fontConfig?: FontConfigData
}

// 样式 配置
export type FormDataGenerator<K extends keyof any, T> = Partial<Record<K, T>>

export type CssAttribute = Record<string, unknown>

export type StyleConfigItem = {
  styleNodeId: string
  selector: string
  cssAttribute: CssAttribute
}

export type StyleConfig = Array<StyleConfigItem>

export type TextShadow = FormDataGenerator<
  'x_offset' | 'y_offset' | 'color' | 'blur_radius',
  string
>

export type Backgrounds = Array<
  {
    background_type: 'image' | 'linear_gradient' | 'radial_gradient'
  } & FormDataGenerator<
    | 'url'
    | 'background_size'
    | 'background_repeat'
    | 'background_clip'
    | 'background_attachment',
    string
  >
>

export type BoxShadow = FormDataGenerator<
  'x_offset' | 'y_offset' | 'blur_radius' | 'spread_radius' | 'color',
  string
>
