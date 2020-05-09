import Movie from '../models/movie'
import Genre from '../models/genre'
import { Op } from 'sequelize'

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

  public static async create (movie: Movie): Promise<Movie | null> {
    // save movie
    const res = new Movie(movie)
    await res.save()
    return this.handelGenre(res)
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
}
