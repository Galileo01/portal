import { baseURL } from '@/network'

export const startDownloadZip = (fileName: string) => {
  const a = document.createElement('a')
  a.href = `${baseURL}/output_code/${fileName}`
  document.documentElement.appendChild(a)
  a.click()
  a.remove()
}

export default startDownloadZip
