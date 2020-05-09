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
    // check unique
    if (
      await Movie.findOne({
        where: {
          _id: movie._id
        }
      }) !== null
    ) {
      throw Error('id have')
    }
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
    // save movie
    const res = new Movie(this.poster(movie))
    await res.save()
    // save movie_genre
    await res.$set('genres', genreModels)
    return res.save()
  }

  public static poster (Movie: Movie): Movie {
    Movie.poster = 'https://img.dianying.fm/poster/' + Movie._id.toString()
    return Movie
  }
}
