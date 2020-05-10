import * as superagent from 'superagent'
import MovieService from '../service/movie-service'
import logger from './log4js'
import InitManager from './init'
import Movie from '../models/movie'

// todo: add crawl by path(ids dont have backdrops attribute)
// todo: upload poster to alicloud oss and fast.io
// todo: back up database function
class GetMovieFromAPI {
  // store id already added, avoid unnecessary query
  private static readonly done: Set<number>=new Set()
  private static readonly task: Set<number>=new Set()
  private static readonly msg: object={ email: 'jinwenjie@live.com', msg: 'Hello, I am getting your data through program, because there is no robots, please contact me if it bothers you' }

  public static async go (): Promise<void> {
    setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleTask()
    }, 15000)
    await InitManager.initLoadDatabase()
    await this.initTask()
    await this.handleTask()
  }

  private static async handleTask (): Promise<void> {
    const ids = []
    let counter = 0
    this.task.forEach((id) => {
      if (counter < 15) {
        ids.push(id)
        this.task.delete(id)
        counter = counter + 1
      }
    })
    await this.getMovies(this.parseIds(ids))
  }

  private static async getMovies (movieIds: string): Promise<void> {
    try {
      // relieve server pressure
      await this.sleep(5000)
      const res = await superagent.get(`https://api.dianying.fm/movies?ids=${movieIds}`).query(this.msg)
      logger.info(`get movies from https://api.dianying.fm/movies?ids=${movieIds}`)
      await Promise.all(res.body.map(async (movie) => {
        try {
          movie.trailers = await this.getTrailer(movie._id.toString())
        } catch (e) {
          logger.error(e)
        }
        try {
          const movieRes = await MovieService.create(movie)
          logger.info(`created: ${movieRes.title} ${movieRes._id}`)
        } catch (err) {
          logger.error(err)
        } finally {
          // add this movie to done
          this.done.add(movie._id)
          // remove this movie form task
          this.task.delete(movie._id)
          // add recs movies to task
          movie.recs.map(id => {
            if (!this.done.has(id)) {
              this.task.add(id)
            }
          })
        }
      }))
    } catch (err) {
      logger.error(err)
    }
  }

  private static async initTask (): Promise<void> {
    const id = await Movie.findAll({
      limit: 1,
      order: [
        ['create_time', 'DESC']
      ]
    })
    logger.info('========start========')
    logger.info(Date.now())
    if (id.length === 0) {
      // return almost a comedy as init id
      logger.info('init id is 30269016')
      this.task.add(30269016)
    } else {
      // return lastest id
      logger.info(`init id is ${id[0].recs.toString()}`)
      id[0].recs.map(id => {
        this.task.add(id)
      })
    }
  }

  private static parseIds (ids: number[]): string {
    // remove id already exist in done
    const filterId = ids.filter(id => {
      return !this.done.has(id)
    })
    // format
    return filterId.join('-')
  }

  private static async getTrailer (movieId: string): Promise<object[]|null> {
    const res = await superagent.get(`https://api.dianying.fm/trailers/${movieId}`)
    return res.body
  }

  private static async sleep (ms): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
GetMovieFromAPI.go()
