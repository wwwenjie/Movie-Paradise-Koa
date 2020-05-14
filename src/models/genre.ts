import {
  AutoIncrement,
  BelongsToMany,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript'
import Movie from './movie'
import MovieGenre from './movie-genre'

@Table({
  createdAt: false,
  updatedAt: false
})
export default class Genre extends Model<Genre> {
  @BelongsToMany(() => Movie, () => MovieGenre)
  movies: Movie[]

  @PrimaryKey
  @AutoIncrement
  @Column
  genre_id: number

  @Unique
  @Column
  name: string

  @Unique
  @Column
  name_en: string
}
