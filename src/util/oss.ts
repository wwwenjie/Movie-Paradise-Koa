import * as Oss from 'ali-oss'
import * as request from 'superagent'
import * as fs from 'fs'
import { ossLogger, httpLogger } from '../core/log4js'
import config from '../config'

export default class OSS {
  private static readonly client = new Oss(config.ossConfig)
  private static readonly localPath: string = config.ossLocalPath
  private static readonly extend: string = '.jfif'
  private static readonly url: string = 'https://img.dianying.fm/poster/'

  static async putPoster (id: number, logger: any = ossLogger): Promise<any> {
    try {
      httpLogger.info(`Get >>>>>> (getPoster) ${this.url + id.toString()}`)
      const res = await request.get(this.url + id.toString())
      fs.writeFile(`${this.localPath}${id}${this.extend}`, res.body, function (err) {
        if (err !== null) {
          logger.error('put local error:', id)
        } else {
          logger.info('put local success:', id)
        }
      })
      httpLogger.info(`Post >>>>>> (getPoster) http://xxx.alicloud.com/poster/${id}${this.extend}`)
      await this.client.put(`poster/${id}${this.extend}`, res.body)
      logger.info('put oss success:', id)
    } catch (err) {
      logger.error('error: ', err)
    }
  }
}
