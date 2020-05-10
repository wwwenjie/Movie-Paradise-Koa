import Movie from '../models/movie'
import Genre from '../models/genre'
import { Op } from 'sequelize'
import Actor from '../models/actor'

export default class MovieService {
  public static async findByAll (): Promise<Movie[] | null> {
    return Movie.findAll()
  }

  public static async findById (_id: number): Promise<Movie | null> {
    return Movie.findByPk(_id)
  }

  public static async findByGenre (genre: string): Promise<Movie[]> {
    const genres = await Genre.scope('movies').findOne({
      where: {
        name: genre
      }
    })
    return genres.movies
  }

  public static async findByActor (actor: string): Promise<Movie[]> {
    const actors = await Actor.scope('movies').findOne({
      where: {
        name: actor
      }
    })
    return actors.movies
  }

  public static async create (movie: Movie): Promise<Movie | null> {
    // save movie
    const res = new Movie(movie)
    await res.save()
    await this.handelGenre(res)
    return this.handelActor(res)
  }

  private static async handelGenre (movie: Movie): Promise<Movie> {
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
    return movie.save()
  }

  private static async handelActor (movie: Movie): Promise<Movie> {
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
    return movie.save()
  }
}
