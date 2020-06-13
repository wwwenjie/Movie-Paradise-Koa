import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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

  @CreateDateColumn()
  create_time: Date

  @UpdateDateColumn()
  update_time: Date
}
