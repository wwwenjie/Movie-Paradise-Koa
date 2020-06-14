import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm'

@Entity()
export default class Comment {
  @ObjectIdColumn()
  _id: ObjectID

  @ObjectIdColumn()
  user_id: ObjectID

  @Column()
  user_name: string

  @Column()
  user_avatar: string

  @Column()
  movie_id: number

  @Column()
  title: string

  @Column()
  summary: string

  @Column()
  rating: number

  // parent id
  @ObjectIdColumn()
  pid: ObjectID

  @Column()
  create_time: Date

  @Column()
  update_time: Date
}
