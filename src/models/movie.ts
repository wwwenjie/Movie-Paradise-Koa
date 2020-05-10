import {
  AutoIncrement,
  BeforeCreate,
  BelongsToMany,
  DataType,
  Column,
  CreatedAt,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import Genre from './genre'
import Actor from './actor'
import MovieGenre from './movie-genre'
import MovieActor from './movie-actor'

@Table
export default class Movie extends Model<Movie> {
  @BeforeCreate
  static async checkUnique (instance: Movie): Promise<boolean> {
    const res = await Movie.findOne({
      where: {
        _id: instance._id
      }
    })
    if (res === null) {
      return true
    } else {
      throw Error(`duplicate primary key: ${instance._id}`)
    }
  }

  @BeforeCreate
  static setValues (instance: Movie): void{
    // change poster
    instance.poster = 'https://img.dianying.fm/poster/' + instance._id.toString()
    const reg = /\d{4}-\d{2}-\d{2}/
    instance.release = new Date(instance.info.release.match(reg)[0])
  }

  @PrimaryKey
  @AutoIncrement
  @Column
  _id: number

  @Column
  imdb_id: string

  @Index
  @Column
  title: string

  @Index
  @Column
  title_en: string

  @Column
  year: number

  // Data redundancy for simplify operation
  @Index
  @Column
  release: Date

  @Column
  poster: string

  @Index
  @Column
  path: string

  @BelongsToMany(() => Genre, () => MovieGenre)
  genres: Genre[]

  @BelongsToMany(() => Actor, () => MovieActor)
  actors: Actor[]

  @Column(DataType.JSON)
  info: {
    director: string
    writer: string
    // Data redundancy for simplify operation
    actors: string
    // Data redundancy for simplify operation
    genre: string
    region: string
    language: string
    release: string
    duration: string
    alias: string
    summary: string
  }

  @Column(DataType.JSON)
  rating: {
    tags: string
    douban_score: string
    douban_votes: number
    imdb_score: string
    imdb_votes: number
  }

  @Column(DataType.JSON)
  recs: [number]

  @Column(DataType.JSON)
  trailers: [{
    _id: string
    'm': number
    'name': string
    'play_url': string
    'cover_url': string
  }]

  @Column(DataType.JSON)
  backdrops: [{
    aspect_ratio: number
    file_path: string
    height: number
    iso_639_1: string
    vote_average: number
    vote_count: number
    width: number
  }]

  @CreatedAt
  create_time: Date

  @UpdatedAt
  update_time: Date
}
