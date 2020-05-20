import Movie from '../entity/movie'
import OSS from '../util/oss'
import { improvementLogger as logger } from '../core/log4js'
import * as request from 'superagent'

interface ImprovementService {
  patchPoster(id: number): Promise<void>
  patchBackdrops(path: string): Promise<object|null>
  patchTrailers(id: number): Promise<object|null>
}

export default class ImprovementServiceImpl implements ImprovementService {
  async patchPoster (id: number): Promise<void> {
    await OSS.putPoster(id, logger)
  }

  async patchBackdrops (path: string): Promise<object|null> {
    const res = await request.get(`https://api.dianying.fm/movies/${path}`)
    const result = await Movie.update({
      path: path
    }, {
      backdrops: res.body
    })
    if (result.raw.affectedRows === 1) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.info(`added backdrops: path:${path} length:${res.body.length}`)
      return res.body
    } else {
      logger.error('unexpected affected:', result)
      logger.error('path:', path)
      return null
    }
  }

  async patchTrailers (id: number): Promise<object|null> {
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
        return res.body
      } else {
        logger.error('unexpected affected:', result)
        logger.error('trailers:', res.body)
        return null
      }
    } catch (err) {
      logger.error('add trailer error:', err)
    }
  }
}
