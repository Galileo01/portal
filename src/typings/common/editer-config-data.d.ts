export type ColorVarValue = Record<string, string>

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
