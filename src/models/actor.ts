import {
  AutoIncrement,
  BelongsToMany,
  Column,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table
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

@Table({
  createdAt: false,
  updatedAt: false
})
export default class Actor extends Model<Actor> {
  @BelongsToMany(() => Movie, () => MovieActor)
  movies: Movie[]

  @PrimaryKey
  @AutoIncrement
  @Column
  actor_id: number

  @Index
  @Column
  name: string

  @Index
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
}
