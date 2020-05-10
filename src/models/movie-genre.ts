import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import Genre from './genre'
import Movie from './movie'

@Table({
  tableName: 'movie_genre',
  createdAt: false,
  updatedAt: false
})
export default class MovieGenre extends Model<MovieGenre> {
  @ForeignKey(() => Genre)
  @Column
  genre_id: number

  @ForeignKey(() => Movie)
  @Column
  movie_id: number
}
