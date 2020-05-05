import { Table, Column, Model, DataType, UpdatedAt, CreatedAt } from 'sequelize-typescript'

@Table
export default class Movie extends Model<Movie> {
  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  _id: number

  @Column
  imdb_id: string

  @Column
  title: string

  @Column
  title_en: string

  @Column
  year: number

  @Column
  poster: string

  @Column
  poster_loc: string

  @Column
  path: string

  @Column(DataType.JSON)
  info: {
    director: string
    writer: string
    actors: string
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
    douban_votes: string
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

  @CreatedAt
  create_time: Date

  @UpdatedAt
  update_time: Date
}
