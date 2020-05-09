import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import Movie from './movie'
import Actor from './actor'

@Table({
  tableName: 'movie_actor',
  createdAt: false,
  updatedAt: false
})
export default class MovieActor extends Model<MovieActor> {
  @ForeignKey(() => Movie)
  @Column
  movie_id: number

  @ForeignKey(() => Actor)
  @Column
  actor_id: number
}
