export const globalThemeMediaQueryList =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')

export const setArcoThemeMoon = () => {
  document.body.setAttribute('arco-theme', 'dark')
}

export const setArcoThemeSun = () => {
  document.body.removeAttribute('arco-theme')
}

const handleMediaQueryChange = (e: MediaQueryListEvent) => {
  if (e.matches) {
    setArcoThemeMoon()
  } else {
    setArcoThemeSun()
  }
}

export const setArcoThemeFollowSystem = () => {
  globalThemeMediaQueryList.addEventListener('change', handleMediaQueryChange)
}

export const removeArcoThemeFollowSystem = () => {
  globalThemeMediaQueryList.removeEventListener(
    'change',
    handleMediaQueryChange
  )
}
