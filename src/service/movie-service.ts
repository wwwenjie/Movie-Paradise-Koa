import Movie from '../models/movie'
import Genre from '../models/genre'
import Actor from '../models/actor'
import MovieActor from '../models/movie-actor'
import MovieGenre from '../models/movie-genre'
import { Op } from 'sequelize'

export default class MovieService {
  public static async findAll (): Promise<Movie[] | null> {
    return Movie.findAll({
      limit: 8
    })
  }

  public static async findById (_id: number): Promise<Movie | null> {
    return Movie.findByPk(_id)
  }

  public static async findByGenre (genre: string, limit: number = 8, offset: number = 0): Promise<Movie[]> {
    // try to store genre id to memory
    const genreOne = await Genre.findOne({
      attributes: ['genre_id'],
      where: {
        name: genre
      }
    })
    const movies = await MovieGenre.findAll({
      attributes: ['movie_id'],
      where: {
        genre_id: genreOne.genre_id
      },
      limit: limit,
      offset: offset
    })
    const ids = movies.map(movie => {
      return movie.movie_id
    })
    return Movie.findAll({
      where: {
        _id: {
          [Op.in]: ids
        }
      }
    })
  }

  public static async findByActor (actor: string, limit: number = 8, offset: number = 0): Promise<Movie[]> {
    const actorOne = await Actor.findOne({
      attributes: ['actor_id'],
      where: {
        name: actor
      }
    })
    const movies = await MovieActor.findAll({
      attributes: ['movie_id'],
      where: {
        actor_id: actorOne.actor_id
      },
      limit: limit,
      offset: offset
    })
    const ids = movies.map(movie => {
      return movie.movie_id
    })
    return Movie.findAll({
      where: {
        _id: {
          [Op.in]: ids
        }
      }
    })
  }

  /**
   * create movie, success: true exist: false error: throw
   * @param movie: Movie
   * @return flag: boolean
   */
  public static async create (movie: Movie): Promise<boolean> {
    const res = await Movie.findOne({
      where: {
        _id: movie._id
      }
    })
    if (res === null) {
      const res = new Movie(movie)
      // save id first
      await res.save()
      // oops, cartoon has no actors🤣
      if (res.info.actors !== undefined) {
        await this.handelActor(res)
      }
      // sometimes, genre also is undefined
      if (res.info.genre !== undefined) {
        await this.handelGenre(res)
      }
      return true
    } else {
      return false
    }
  }

  private static async handelGenre (movie: Movie): Promise<void> {
    // get genre array from info
    const genreValues = movie.info.genre.split('/')
    // add genre to genre table if it dosent exist
    // todo: import translate API to add name_en
    await Promise.all(genreValues.map(async (genre) => {
      await Genre.findOrCreate({
        where: {
          name: genre
        }
      })
    }))
    // get genre from genre table
    const genreModels = await Genre.findAll({
      where: {
        name: {
          [Op.in]: genreValues
        }
      }
    })
    // save movie_genre
    await movie.$set('genres', genreModels)
    await movie.save()
  }

  private static async handelActor (movie: Movie): Promise<void> {
    // same with handelGenre
    // if it possible, find an API to add actors info by name
    const actorValues = movie.info.actors.split('/')
    await Promise.all(actorValues.map(async (actor) => {
      await Actor.findOrCreate({
        where: {
          name: actor
        }
      })
    }))
    const actorModels = await Actor.findAll({
      where: {
        name: {
          [Op.in]: actorValues
        }
      }
    })
    await movie.$set('actors', actorModels)
    await movie.save()
  }
}
