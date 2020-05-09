import {
  AutoIncrement,
  BelongsToMany,
  Column,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique
} from 'sequelize-typescript'
import Movie from './movie'
import MovieGenre from './movie-genre'

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
export default class Genre extends Model<Genre> {
  @BelongsToMany(() => Movie, () => MovieGenre)
  movies: Movie[]

  @PrimaryKey
  @AutoIncrement
  @Column
  genre_id: number

  @Column
  name: string

  @Unique
  @Column
  name_en: string
}
