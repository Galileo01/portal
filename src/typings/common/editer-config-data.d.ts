export type StringKeyValueObject = Record<string, string>

export type ColorVarValue = StringKeyValueObject

export type ColorVarMap = Record<
  string,
  {
    label: string
    varKey: string
  }
>

export type ThemeConfigData = Partial<ColorVarValue>

export type FontFormData = {
  globalFont: string[]
  usedFont: string[][]
}

export type FontConfigData = Partial<FontFormData>

export type CssAttribute = Record<string, unknown>

export type StyleConfigItem = {
  styleNodeId: string
  cssAttribute: CssAttribute
}

export type FormDataGenerator<K extends keyof any, T> = Partial<Record<K, T>>
