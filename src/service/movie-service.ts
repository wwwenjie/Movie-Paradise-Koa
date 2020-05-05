import Movie from '../models/movie'

export default class MovieService {
  public static async findByAll (): Promise<Movie[] | null> {
    return Movie.findAll()
  }

  public static async findById (_id: number): Promise<Movie | null> {
    return Movie.findByPk(_id)
  }

  public static async create (Movie: Movie): Promise<Movie | null> {
    return Movie.save()
  }
}
