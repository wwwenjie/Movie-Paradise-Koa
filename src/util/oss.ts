import * as Oss from 'ali-oss'
import * as request from 'superagent'
import * as fs from 'fs'
import { ossLogger as logger } from '../core/log4js'
import config from '../config'

export default class OSS {
  private static readonly oss = new Oss(config.ossConfig)
  private static readonly localPath: string = config.ossLocalPath
  private static readonly extend: string = '.jfif'
  private static readonly url: string = 'https://img.dianying.fm/poster/'

  static async putPoster (id: number): Promise<any> {
    try {
      const res = await request.get(this.url + id.toString())
      fs.writeFile(`${this.localPath}${id}${this.extend}`, res.body, function (err) {
        if (err !== null) {
          logger.error('put local error:', id)
        } else {
          logger.info('put local success:', id)
        }
      })
      await this.oss.put(`poster/${id}${this.extend}`, res.body)
      logger.info('put oss success:', id)
    } catch (err) {
      logger.error('error: ', err)
    }
  }
}
