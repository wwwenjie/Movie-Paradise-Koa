import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import Movie from './movie'
import MovieActor from './movie-actor'

@Scopes(() => ({
  movies: {
    attributes: [],
    include: [
      {
        model: Movie,
        through: { attributes: [] }
      }
    ]
  }
}))

@Table
export default class Actor extends Model<Actor> {
  @BelongsToMany(() => Movie, () => MovieActor)
  movies: Movie[]

  @PrimaryKey
  @AutoIncrement
  @Column
  actor_id: number

  @Column
  name: string

  @Column
  name_en: string

  @Column
  gender: string

  @Column
  birthday: Date

  @Column
  born_place: string

  @Column
  summary: string

  @Column
  alt: string

  @CreatedAt
  create_time: Date

  @UpdatedAt
  update_time: Date
}
