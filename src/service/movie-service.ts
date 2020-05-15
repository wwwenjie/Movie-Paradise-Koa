import Movie from '../entity/movie'
import Genre from '../entity/genre'
import Actor from '../entity/actor'
import { BaseEntity } from 'typeorm'

interface MovieService {
  findByPath(path: string): Promise<Movie>
  findByGenre(genre: string, limit: number, offset: number): Promise<Movie[]>
  findByActor(actor: string, limit: number, offset: number): Promise<Movie[]>
  update(movie: Movie): Promise<Movie>
  create(movie: Movie): Promise<boolean>
  handelGenre (movie: Movie): Promise<Movie>
  handelActor (movie: Movie): Promise<Movie>
}

export default class MovieServiceImpl implements MovieService {
  async findByPath (path: string): Promise<Movie> {
    return Movie.findOne({
      path: path
    })
  }

  async findByActor (actor: string, limit: number = 8, offset: number = 0): Promise<Movie[]> {
    const query = await Movie.query('SELECT movie_id as id FROM movie_actor WHERE ' +
      'actor_id = (SELECT actor_id FROM actor WHERE name = ?) LIMIT ? OFFSET ?',
    [actor, limit, offset])
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

  async findByGenre (genre: string, limit: number = 8, offset: number = 0): Promise<Movie[]> {
    // security
    const query = await Movie.query('SELECT movie_id as id FROM movie_genre WHERE ' +
      'genre_id = (SELECT genre_id FROM genre WHERE name = ?) LIMIT ? OFFSET ?',
    [genre, limit, offset])
    const ids = query.map(row => {
      return row.id
    })
    return Movie.createQueryBuilder()
      .whereInIds(ids)
      .getMany()
  }

  async create (movie: Movie): Promise<boolean> {
    movie = await this.handelGenre(movie)
    movie = await this.handelActor(movie)
    await Movie.save(movie)
    return true
  }

  async update (movie: Movie): Promise<Movie> {
    movie = await this.handelGenre(movie)
    movie = await this.handelActor(movie)
    return Movie.save(movie)
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
        const genre = new Genre()
        genre.name = genreName
        genreEntity.push(await genre.save())
      } else {
        genreEntity.push(genre)
      }
    }))
    movie.genres = genreEntity
    return Movie.save(movie)
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
        const actor = new Actor()
        actor.name = actorName
        actorEntity.push(await actor.save())
      } else {
        actorEntity.push(actor)
      }
    }))
    movie.actors = actorEntity
    return Movie.save(movie)
  }
}
