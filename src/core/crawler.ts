import * as request from 'superagent'
import MovieService from '../service/movie-service'
import { movieLogger as logger } from './log4js'
import InitManager from './init'
import Movie from '../models/movie'
import OSS from '../util/oss'

// todo: back up database function
class GetMovieFromAPI {
  // fastMode dont have backdrops,use ids: number. set to false to use path: string
  private static readonly fastMode: boolean = true
  // store id already added, avoid unnecessary query
  private static readonly done: Set<number|string> = new Set()
  private static readonly task: Set<number|string> = new Set()
  private static readonly msg: object = { email: 'jinwenjie@live.com', msg: 'Hello, I am getting your data through program, because there is no robots, please contact me if it bothers you' }
  private static url: string

  public static async go (): Promise<void> {
    await InitManager.initLoadDatabase()
    await this.initTask()
    const timeout = this.fastMode ? 15000 : 5000
    setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleTask()
    }, timeout)
  }

  private static async handleTask (): Promise<void> {
    if (this.fastMode) {
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
    } else {
      const path = [...this.task][0]
      this.task.delete(path)
      await this.getMovies(path.toString())
    }
  }

  private static async getMovies (query: string): Promise<void> {
    try {
      logger.info(`get movies from ${this.url}${query}`)
      const res = await request.get(this.url + query).query(this.msg)
      if (this.fastMode) {
        await this.addMovieById(res.body)
      } else {
        await this.addMovieByPath(res.body)
      }
    } catch (err) {
      logger.error(err)
    }
  }

  private static async addMovieById (movies): Promise<void> {
    await Promise.all(movies.map(async (movie) => {
      // get movie trailer
      try {
        movie.trailers = await this.getTrailer(movie._id.toString())
      } catch (e) {
        logger.error(e)
      }
      // create movie
      try {
        const movieRes = await MovieService.create(movie)
        logger.info(`created: ${movieRes.title} ${movieRes._id}`)
        // back up poster
        await OSS.putPoster(movieRes.poster)
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
  }

  private static async addMovieByPath (movie): Promise<void> {
    // get movie trailer
    try {
      movie.trailers = await this.getTrailer(movie._id.toString())
    } catch (e) {
      logger.error(e)
    }
    // create movie
    try {
      const movieRes = await MovieService.create(movie)
      logger.info(`created: ${movieRes.title} ${movieRes._id}`)
      // back up poster
      await OSS.putPoster(movieRes.poster)
    } catch (err) {
      logger.error(err)
    } finally {
      // add this movie to done
      this.done.add(movie.path)
      // remove this movie form task
      this.task.delete(movie.path)
      // add recs movies path to task
      if (this.task.size < 15) {
        const res = await request.get(`https://api.dianying.fm/movies?ids=${this.parseIds(movie.recs)}`).query(this.msg)
        res.body.map(movie => {
          if (!this.done.has(movie.path)) {
            this.task.add(movie.path)
          }
        })
      }
    }
  }

  private static async initTask (): Promise<void> {
    // set url by mode
    this.url = this.fastMode ? 'https://api.dianying.fm/movies?ids=' : 'https://api.dianying.fm/movies/'
    // get least movie as init movie
    // make sure you have at least one movie in database
    const initMovie = await Movie.findAll({
      limit: 1,
      order: [
        ['create_time', 'DESC']
      ]
    })
    logger.info('========start========')
    logger.info(new Date(Date.now()))
    logger.info(`crawler mode: ${this.fastMode ? 'fast' : 'fully'}`)
    // return init param
    if (this.fastMode) {
      logger.info(`init ids is ${initMovie[0].recs.toString()}`)
      initMovie[0].recs.map(id => {
        this.task.add(id)
      })
    } else {
      logger.info(`init path is ${initMovie[0].path}`)
      this.task.add(initMovie[0].path)
    }
    // load done from database
    const doneMovies = await Movie.findAll({
      attributes: ['_id', 'path'],
      limit: 500,
      order: [
        ['create_time', 'DESC']
      ]
    })
    doneMovies.map(movie => {
      this.done.add(this.fastMode ? movie._id : movie.path)
    })
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
    const res = await request.get(`https://api.dianying.fm/trailers/${movieId}`)
    return res.body
  }

  private static async sleep (ms): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
GetMovieFromAPI.go()
