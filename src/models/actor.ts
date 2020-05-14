import {
  AutoIncrement,
  BelongsToMany,
  Column,
  Index,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import Movie from './movie'
import MovieActor from './movie-actor'

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
