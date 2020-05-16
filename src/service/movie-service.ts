import Movie from '../entity/movie'
import Genre from '../entity/genre'
import Actor from '../entity/actor'

interface MovieService {
  findByPath(path: string): Promise<Movie>
  findByGenre(genre: string, limit: string, offset: string): Promise<Movie[]>
  findByActor(actor: string, limit: string, offset: string): Promise<Movie[]>
  update(movie: Movie): Promise<void | Error>
  create(movie: Movie): Promise<void | Error>
  handelGenre (movie: Movie): Promise<Movie>
  handelActor (movie: Movie): Promise<Movie>
}

export default class MovieServiceImpl implements MovieService {
  async findByPath (path: string): Promise<Movie> {
    return Movie.findOne({
      path: path
    })
  }

  async findByActor (actor: string, limit: string = '8', offset: string = '0'): Promise<Movie[]> {
    const query = await Movie.query('SELECT movie_id as id FROM movie_actor WHERE ' +
      'actor_id = (SELECT actor_id FROM actor WHERE name = ?) LIMIT ? OFFSET ?',
    [actor, parseInt(limit), parseInt(offset)])
    if (query.length === 0) {
      return []
    }
    const ids = query.map(row => {
      return row.id
    })
    return Movie.createQueryBuilder()
      .whereInIds(ids)
      .getMany()
  }

  async findByGenre (genre: string, limit: string = '8', offset: string = '0'): Promise<Movie[]> {
    // security
    const query = await Movie.query('SELECT movie_id as id FROM movie_genre WHERE ' +
      'genre_id = (SELECT genre_id FROM genre WHERE name = ?) LIMIT ? OFFSET ?',
    [genre, parseInt(limit), parseInt(offset)])
    const ids = query.map(row => {
      return row.id
    })
    return Movie.createQueryBuilder()
      .whereInIds(ids)
      .getMany()
  }

  async create (movie: Movie): Promise<void | Error> {
    if (await Movie.findOne({ _id: movie._id }) !== undefined) {
      throw Error('movie existed')
    }
    await this.update(movie)
  }

  async update (movie: Movie): Promise<void | Error> {
    this.setValues(movie)
    movie = await this.handelGenre(movie)
    movie = await this.handelActor(movie)
    await Movie.save(movie)
  }

  // Duplicated code
  async handelGenre (movie: Movie): Promise<Movie> {
    if (movie.info.genre === undefined) {
      return movie
    }
    const genreValues = movie.info.genre.split('/')
    const genreEntity = []
    await Promise.all(genreValues.map(async genreName => {
      const genre = await Genre.findOne({
        name: genreName
      })
      if (genre === undefined) {
        const res = await Genre.insert({
          name: genreName
        })
        genreEntity.push(...res.identifiers)
      } else {
        genreEntity.push(genre)
      }
    }))
    movie.genres = genreEntity
    return movie
  }

  async handelActor (movie: Movie): Promise<Movie> {
    if (movie.info.actors === undefined) {
      return movie
    }
    const actorValues = movie.info.actors.split('/')
    const actorEntity = []
    await Promise.all(actorValues.map(async actorName => {
      const actor = await Actor.findOne({
        name: actorName
      })
      if (actor === undefined) {
        const res = await Actor.insert({
          name: actorName
        })
        actorEntity.push(...res.identifiers)
      } else {
        actorEntity.push(actor)
      }
    }))
    movie.actors = actorEntity
    return movie
  }

  setValues (movie: Movie): void{
    // change poster
    movie.poster = 'https://img.dianying.fm/poster/' + movie._id.toString()
    const date = RegExp(/\d{4}-\d{2}-\d{2}/)
    const year = RegExp(/\d{4}/)
    if (movie.year == null && movie.info.release == null) {
      movie.year = 0
      movie.release = new Date(movie.year)
    } else if (movie.info.release != null) {
      // add movie.release
      if (date.test(movie.info.release)) {
        movie.release = new Date(movie.info.release.match(date)[0])
      } else {
        movie.release = new Date(movie.info.release.match(year)[0])
      }
      // add year
      movie.year = parseInt(movie.info.release.match(year)[0])
    } else if (movie.year != null) {
      movie.release = new Date(movie.year)
    }
  }
}
