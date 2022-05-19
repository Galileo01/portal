// @ts-nocheck
import COS from 'cos-js-sdk-v5'
import { devLogger } from '@/common/utils'

import instance from './index'

export const getCredential = () => instance.get('/sts/getCredential')

const cos = new COS({
  getAuthorization: (options, cb) => {
    getCredential().then((res) => {
      if (res.success) {
        const { credentials, startTime, expiredTime } = res.data
        devLogger('getCredential res', res)
        cb({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000000
        })
      }
    })
  },
})

export const cosDomain =
  'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/'

export const uploadCos = (imgFile: Blob, pageId: string) =>
  new Promise<string>((resolve, reject) => {
    const fileName = `img/portal/${pageId}.png`
    cos.putObject(
      {
        Bucket: 'cos-01-1303103441' /* 必须 */,
        Region: 'ap-chengdu' /* 存储桶所在地域，必须字段 */,
        Key: fileName, // 目录,文件名,
        StorageClass: 'STANDARD',
        Body: imgFile, // 上传文件对象
        onProgress(progressData) {
          devLogger('cos.putObject', JSON.stringify(progressData))
          if (progressData.percent === 1) {
            resolve(`${cosDomain}${fileName}`)
          }
        },
      },
      (err, data) => {
        if (err) {
          devLogger('cos.putObject error', err || data)
          reject(err || data)
        }
      }
    )
  })
