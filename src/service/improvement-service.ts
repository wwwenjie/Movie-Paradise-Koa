import Movie from '../entity/movie'
import OSS from '../util/oss'
import { improvementLogger as logger } from '../core/log4js'

interface ImprovementService {
  addPoster(id: number): Promise<void>
  addBackdrops(id: number, backdrops: Object[]): Promise<void>
  addTrailers(id: number, trailers: Object[]): Promise<void>
}

export default class ImprovementServiceImpl implements ImprovementService {
  async addPoster (id: number): Promise<void> {
    await OSS.putPoster(id, logger)
  }

  async addBackdrops (id: number, backdrops: Object[]): Promise<void> {
    const result = await Movie.update({
      _id: id
    }, {
      backdrops: backdrops
    })
    if (result.raw.affectedRows === 1) {
      logger.info(`added backdrops: id:${id} length:${backdrops.length}`)
    } else {
      logger.error('unexpected affected:', result)
      logger.error('id:', id)
    }
  }

  async addTrailers (id: number, trailers: Object[]): Promise<void> {
    try {
      const result = await Movie.update({
        _id: id
      }, {
        trailers: trailers
      })
      if (result.raw.affectedRows === 1) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger.info(`added trailer: id:${id} length:${trailers.length}`)
      } else {
        logger.error('unexpected affected:', result)
        logger.error('trailers:', trailers)
      }
    } catch (err) {
      logger.error('add trailer error:', err)
    }
  }
}
