import * as request from 'superagent'
import MovieService from '../service/movie-service'
import { movieLogger as logger, httpLogger } from './log4js'
import InitManager from './init'
import Movie from '../models/movie'
import OSS from '../util/oss'

// todo: back up database function
class GetMovieFromAPI {
  // fastMode dont have backdrops,use ids: number. set to false to use path: string
  private static readonly fastMode: boolean = true
  // use for fastMode, multiple request at a same time
  private static readonly concurrencyMode: boolean = false
  // store id already added, avoid unnecessary query
  private static readonly done: Set<number|string> = new Set()
  private static readonly task: Set<number|string> = new Set()
  private static readonly msg: object = { email: 'jinwenjie@live.com', msg: 'Hello, I am getting your data through program, because there is no robots, please contact me if it bothers you, sorry for the inconvenient' }
  private static exist: number = 0
  private static url: string

  public static async go (): Promise<void> {
    await InitManager.initLoadDatabase()
    await this.initTask()
    setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleTask()
    }, this.fastMode ? 15000 : 5000)
    setInterval(() => {
      console.log('=========task===========')
      console.log(this.task.size)
      console.log('=========done===========')
      console.log(this.done.size)
      console.log('=========exist==========')
      console.log(this.exist)
    }, 5000)
    setInterval(() => {
      httpLogger.info('Get >>>>>> (msg) https://api.dianying.fm/movies')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      request.get('https://api.dianying.fm/movies').query(this.msg)
    }, 60000)
  }

  private static async initTask (): Promise<void> {
    // set url by mode
    this.url = this.fastMode ? 'https://api.dianying.fm/movies?ids=' : 'https://api.dianying.fm/movies/'
    // get least movie as init movie
    // make sure you have at least one movie in database
    const initMovie = await Movie.findAll({
      attributes: ['recs', 'path'],
      limit: 20,
      order: [
        ['create_time', 'DESC']
      ]
    })
    // make sure movie.recs is exist
    let randomIndex = Math.floor(Math.random() * 20)
    while (initMovie[randomIndex].recs === undefined) {
      randomIndex = Math.floor(Math.random() * 20)
    }
    logger.info('========start========')
    logger.info(new Date(Date.now()))
    logger.info(`crawler mode: ${this.fastMode ? 'fast' : 'fully'}`)
    // return init param
    if (this.fastMode) {
      logger.info(`init ids is ${initMovie[randomIndex].recs.toString()}`)
      initMovie[randomIndex].recs.map(id => {
        this.task.add(id)
      })
    } else {
      logger.info(`init path is ${initMovie[randomIndex].path}`)
      this.task.add(initMovie[randomIndex].path)
    }
    // it may cause task empty
    // load done from database
    // const doneMovies = await Movie.findAll({
    //   attributes: ['_id', 'path'],
    //   limit: 500,
    //   order: [
    //     ['create_time', 'DESC']
    //   ]
    // })
    // doneMovies.map(movie => {
    //   this.done.add(this.fastMode ? movie._id : movie.path)
    // })
  }

  private static async handleTask (): Promise<void> {
    if (this.task.size > 0) {
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
    } else {
      console.log('waning! task is empty')
    }
  }

  private static async getMovies (query: string): Promise<void> {
    try {
      logger.info(`get movies from ${this.url}${query}`)
      httpLogger.info(`Get >>>>>> (getMovies) ${this.url + query}`)
      const res = await request.get(this.url + query)
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
    if (this.concurrencyMode) {
      await Promise.all(movies.map(async (movie) => {
        await this.createMovie(movie)
        // add recs movies to task
        if (movie.recs !== undefined) {
          movie.recs.map(id => {
            if (!this.done.has(id)) {
              this.task.add(id)
            }
          })
        }
      }))
    } else {
      for (const movie of movies) {
        await this.sleep(1000)
        await this.createMovie(movie)
        // add recs movies to task
        if (movie.recs !== undefined) {
          movie.recs.map(id => {
            if (!this.done.has(id)) {
              this.task.add(id)
            }
          })
        }
      }
    }
  }

  private static async addMovieByPath (movie): Promise<void> {
    await this.createMovie(movie)
    // add recs movies path to task
    if (this.task.size < 15) {
      httpLogger.info(`Get >>>>>> (addMovieByPath) https://api.dianying.fm/movies?ids=${this.parseIds(movie.recs)}`)
      const res = await request.get(`https://api.dianying.fm/movies?ids=${this.parseIds(movie.recs)}`)
      res.body.map(movie => {
        if (!this.done.has(movie.path)) {
          this.task.add(movie.path)
        }
      })
    }
  }

  private static async createMovie (movie: Movie): Promise<void> {
    await this.getTrailer(movie)
    // create movie
    try {
      console.log('========creating')
      const flag = await MovieService.create(movie)
      if (!flag) {
        this.exist++
        logger.info(`existed: ${movie.title} ${movie._id}`)
        console.log('========existed')
        return
      }
      console.log('========finished')
      logger.info(`created: ${movie.title} ${movie._id}`)
      // add this movie to done
      this.done.add(movie._id)
      // remove this movie form task
      this.task.delete(movie._id)
      // back up poster
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      OSS.putPoster(movie._id)
    } catch (err) {
      logger.error(err)
      logger.error(movie)
    }
  }

  private static async getTrailer (movie: Movie): Promise<void> {
    try {
      httpLogger.info(`Get >>>>>> (getTrailer) https://api.dianying.fm/trailers/${movie._id}`)
      const res = await request.get(`https://api.dianying.fm/trailers/${movie._id}`)
      movie.trailers = res.body
    } catch (err) {
      logger.error('trailer:', err)
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

  private static async sleep (ms): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
GetMovieFromAPI.go()
