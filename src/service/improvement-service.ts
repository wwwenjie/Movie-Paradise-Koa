import Movie from '../entity/movie'
import OSS from '../util/oss'
import * as request from 'superagent'
import { improvementLogger as logger } from '../core/log4js'

interface ImprovementService {
  addBackdrop(id: number, backdrops: Object[]): Promise<void>
  addPoster(id: number): Promise<void>
  addTrailer(id: number): Promise<void>
}

export default class ImprovementServiceImpl implements ImprovementService {
  async addBackdrop (id: number, backdrops: Object[]): Promise<void> {
    const result = await Movie.update({
      _id: id
    }, {
      backdrops: backdrops
    })
    if (result.raw.affectedRows === 1) {
      logger.info(`added backdrop: id:${id} length:${backdrops.length}`)
    } else {
      logger.error('unexpected affected:', result)
      logger.error('id:', id)
    }
  }

  async addPoster (id: number): Promise<void> {
    await OSS.putPoster(id, logger)
  }

  async addTrailer (id: number): Promise<void> {
    try {
      const res = await request.get(`https://api.dianying.fm/trailers/${id}`)
      const result = await Movie.update({
        _id: id
      }, {
        trailers: res.body
      })
      if (result.raw.affectedRows === 1) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger.info(`added trailer: id:${id} length:${res.body.length}`)
      } else {
        logger.error('unexpected affected:', result)
        logger.error('res:', res.body)
      }
    } catch (err) {
      logger.error('add trailer error:', err)
    }
  }
}
